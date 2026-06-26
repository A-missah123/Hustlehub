package com.hustlehub.hustlehub.repository;
import com.hustlehub.hustlehub.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByTaskId(Long taskId);
    List<Bid> findByTaskerId(Long taskerId);
}