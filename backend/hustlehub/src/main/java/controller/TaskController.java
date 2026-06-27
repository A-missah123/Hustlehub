package com.hustlehub.hustlehub.controller;
import com.hustlehub.hustlehub.model.Task;
import com.hustlehub.hustlehub.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {
    private final TaskService taskService;
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllOpenTasks();
    }
    @PostMapping("/{posterId}")
    public ResponseEntity<?> createTask(@RequestBody Task task, @PathVariable Long posterId) {
        try {
            return ResponseEntity.ok(taskService.createTask(task, posterId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}