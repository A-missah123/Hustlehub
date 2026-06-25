package com.hustlehub.hustlehub.service;
import com.hustlehub.hustlehub.dto.RegisterRequest;
import com.hustlehub.hustlehub.model.User;
import com.hustlehub.hustlehub.model.Wallet;
import com.hustlehub.hustlehub.repository.UserRepository;
import com.hustlehub.hustlehub.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
<<<<<<< HEAD
import org.springframework.security.crypto.password.PasswordEncoder;
=======
>>>>>>> 53d7a84579d9d43e580542cb2354b524a70f8bf6
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
<<<<<<< HEAD
    private final PasswordEncoder passwordEncoder;
=======
>>>>>>> 53d7a84579d9d43e580542cb2354b524a70f8bf6
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
<<<<<<< HEAD
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
=======
        user.setPasswordHash(request.getPassword());
>>>>>>> 53d7a84579d9d43e580542cb2354b524a70f8bf6
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