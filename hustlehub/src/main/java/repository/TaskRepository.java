package com.hustlehub.hustlehub.repository;
import com.hustlehub.hustlehub.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(String status);
    List<Task> findByPosterId(Long posterId);
}