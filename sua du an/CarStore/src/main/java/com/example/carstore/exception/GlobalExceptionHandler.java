package com.example.carstore.exception;

import com.example.carstore.util.ResponseUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining("; "));
        log.warn("Validation failed: {}", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseUtils.fail(message));
    }

    @ExceptionHandler(BindException.class)
    @ResponseBody
    public ResponseEntity<Object> handleBind(BindException ex) {
        String message = ex.getAllErrors().stream().map(o -> o.getDefaultMessage()).collect(Collectors.joining("; "));
        log.warn("Bind error: {}", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseUtils.fail(message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public ResponseEntity<Object> handleIllegalArg(IllegalArgumentException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseUtils.fail(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<Object> handleAll(Exception ex) {

        log.error("Unexpected error", ex);

        Throwable root = ex;

        while (root.getCause() != null) {
            root = root.getCause();
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseUtils.fail(
                        root.getClass().getName() + " : " + root.getMessage()));
    }
}
