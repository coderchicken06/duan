package com.example.carstore.service;

import com.example.carstore.entity.News;
import com.example.carstore.repository.NewsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NewsServiceTest {
    @Mock private NewsRepository repository;
    private NewsService service;

    @BeforeEach
    void setUp() {
        service = new NewsService(repository);
    }

    @Test
    void saveAutomaticallyGeneratesSlugFromVietnameseTitle() {
        News news = news("BMW X5 2026 chính thức ra mắt");
        when(repository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));

        News saved = service.save(news, "admin");

        assertEquals("bmw-x5-2026-chinh-thuc-ra-mat", saved.getSlug());
        assertEquals("admin", saved.getAuthor());
        assertNotNull(saved.getCreatedAt());
        verify(repository).existsBySlugAndIdNot("bmw-x5-2026-chinh-thuc-ra-mat", 0);
    }

    @Test
    void updateRegeneratesSlugWhenFrontendSendsBlankSlug() {
        News existing = news("Tiêu đề cũ");
        existing.setId(7);
        existing.setCreatedAt(new Date(1_000L));
        when(repository.findById(7)).thenReturn(Optional.of(existing));

        News update = news("Tin khuyến mãi tháng tám");
        update.setId(7);
        update.setSlug("");
        when(repository.save(any(News.class))).thenAnswer(invocation -> invocation.getArgument(0));
        News saved = service.save(update, "admin");

        assertEquals("tin-khuyen-mai-thang-tam", saved.getSlug());
        assertEquals(1_000L, saved.getCreatedAt().getTime());
        verify(repository).existsBySlugAndIdNot("tin-khuyen-mai-thang-tam", 7);
    }

    @Test
    void saveRejectsAutomaticallyGeneratedDuplicateSlug() {
        News news = news("BMW X5 mới");
        when(repository.existsBySlugAndIdNot("bmw-x5-moi", 0)).thenReturn(true);

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> service.save(news, "admin"));

        assertEquals("Slug tin tức đã tồn tại.", error.getMessage());
        verify(repository, never()).save(any());
    }

    private News news(String title) {
        News news = new News();
        news.setTitle(title);
        news.setStatus("DRAFT");
        return news;
    }
}
