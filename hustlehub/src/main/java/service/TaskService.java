package com.hustlehub.hustlehub.service;
import com.hustlehub.hustlehub.model.Task;
import com.hustlehub.hustlehub.model.User;
import com.hustlehub.hustlehub.repository.TaskRepository;
import com.hustlehub.hustlehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    public Task createTask(Task task, Long posterId) {
        User poster = userRepository.findById(posterId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setPoster(poster);
        return taskRepository.save(task);
    }
    public List<Task> getAllOpenTasks() {
        return taskRepository.findByStatus("open");
    }
    public List<Task> getTasksByUser(Long userId) {
        return taskRepository.findByPosterId(userId);
    }
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
}