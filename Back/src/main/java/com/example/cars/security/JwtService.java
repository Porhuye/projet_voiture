package com.example.cars.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔑 Clé secrète : ≥ 32 caractères pour HS256
    private static final String SECRET_KEY =
            "this-is-a-very-long-and-secure-secret-key-123456";

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 1h
    private static final long EXPIRATION_TIME = 1000L * 60 * 60;

    /** Génère un token pour un username. */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Extrait le username (subject) du token. */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    /** Vérifie que le token est bien signé et non expiré. */
    public boolean isValid(String token) {
        try {
            // Si parsing OK → signature valide et non expiré
            extractAllClaims(token);
            return true;
        } catch (SecurityException | IllegalArgumentException ex) {
            return false;
        }
    }

    /** Vérifie validité + correspondance du username (optionnel). */
    public boolean isTokenValid(String token, String expectedUsername) {
        if (!isValid(token)) return false;
        return expectedUsername.equals(extractUsername(token));
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
