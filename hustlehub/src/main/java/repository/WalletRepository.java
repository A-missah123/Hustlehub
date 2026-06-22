package com.hustlehub.hustlehub.repository;
import com.hustlehub.hustlehub.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUserId(Long userId);
}