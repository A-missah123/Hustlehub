package com.hustlehub.hustlehub.service;
import com.hustlehub.hustlehub.dto.RegisterRequest;
import com.hustlehub.hustlehub.model.User;
import com.hustlehub.hustlehub.model.Wallet;
import com.hustlehub.hustlehub.repository.UserRepository;
import com.hustlehub.hustlehub.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : "both");
        User saved = userRepository.save(user);
        Wallet wallet = new Wallet();
        wallet.setUser(saved);
        walletRepository.save(wallet);
        return saved;
    }
    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPasswordHash().equals(password));
    }
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}