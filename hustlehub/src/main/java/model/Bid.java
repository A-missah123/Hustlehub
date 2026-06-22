package com.hustlehub.hustlehub.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "bids")
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
    @ManyToOne
    @JoinColumn(name = "tasker_id", nullable = false)
    private User tasker;
    @Column(nullable = false)
    private Double amount;
    private String note;
    private String status = "pending";
    private LocalDateTime createdAt = LocalDateTime.now();
}