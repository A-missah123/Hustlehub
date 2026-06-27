
package com.hustlehub.hustlehub.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "poster_id", nullable = false)
    private User poster;
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String description;
    private String taskType = "other";
    private Double budget;
    private Boolean isBarter = false;
    private String location;
    private LocalDateTime dueDate;
    private String status = "open";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}