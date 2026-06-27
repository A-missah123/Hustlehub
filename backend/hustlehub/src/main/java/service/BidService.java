package com.hustlehub.hustlehub.service;
import com.hustlehub.hustlehub.model.Bid;
import com.hustlehub.hustlehub.model.Task;
import com.hustlehub.hustlehub.model.User;
import com.hustlehub.hustlehub.repository.BidRepository;
import com.hustlehub.hustlehub.repository.TaskRepository;
import com.hustlehub.hustlehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class BidService {
    private final BidRepository bidRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    public Bid placeBid(Long taskId, Long taskerId, Double amount, String note) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User tasker = userRepository.findById(taskerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Bid bid = new Bid();
        bid.setTask(task);
        bid.setTasker(tasker);
        bid.setAmount(amount);
        bid.setNote(note);
        return bidRepository.save(bid);
    }
    public List<Bid> getBidsByTask(Long taskId) {
        return bidRepository.findByTaskId(taskId);
    }
}