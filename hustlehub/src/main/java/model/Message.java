package com.hustlehub.hustlehub.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
    @Column(nullable = false)
    private String content;
    private Boolean isRead = false;
    private LocalDateTime sentAt = LocalDateTime.now();
}