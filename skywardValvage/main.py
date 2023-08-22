import pygame
import sys
import random

# Inisialisasi Pygame
pygame.init()

# FPS Game
clock = pygame.time.Clock()

# Konfigurasi Layar
WIDTH, HEIGHT = 1200, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Skyward Salvage")

# Muat gambar latar belakang, pesawat, musuh, dan peluru
background = pygame.image.load("skywardValvage/images/space.png")
background = pygame.transform.scale(background, (WIDTH, HEIGHT))
background_rect = background.get_rect()

airplane = pygame.image.load("skywardValvage/images/airplane.png")
airplane = pygame.transform.scale(airplane, (airplane.get_width() // 2, airplane.get_height() // 2))
airplane_rect = airplane.get_rect()
airplane_rect.centerx = WIDTH // 2
airplane_rect.bottom = HEIGHT - 10

# Inisialisasi dan setup musuh
def setup_enemy(image_path):
    enemy = pygame.image.load(image_path)
    enemy = pygame.transform.scale(enemy, (enemy.get_width() // 3, enemy.get_height() // 3))
    rect = enemy.get_rect()
    rect.inflate_ip(-75, -75)
    rect.x = random.randint(0, WIDTH - rect.width)
    rect.y = 0 - rect.height
    return enemy, rect

enemy, enemy_rect = setup_enemy("skywardValvage/images/enemy.png")
enemy2, enemy2_rect = setup_enemy("skywardValvage/images/enemy2.png")

# Setup peluru
bullet = pygame.image.load("skywardValvage/images/bullets.png")
bullet = pygame.transform.scale(bullet, (bullet.get_width() // 3, bullet.get_height() // 3))  # Ubah ukuran peluru
bullet_rects = []
bullet_speed = -2

last_shot_time = 0  # Waktu terakhir menembak
shot_cooldown = 5000  # milidetik (0.5 detik)

# Score
font = pygame.font.Font(None, 36)
score = 0

# Kecepatan pesawat
speed = 1

# Game loop
running = True
while running:
    current_time = pygame.time.get_ticks()
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                bullet_rect = bullet.get_rect(center=(airplane_rect.centerx, airplane_rect.top))
                bullet_rects.append(bullet_rect)
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE and current_time - last_shot_time > shot_cooldown:
                        bullet_rect = bullet.get_rect(center=(airplane_rect.centerx, airplane_rect.top))
                        bullet_rects.append(bullet_rect)
                        last_shot_time = current_time

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        airplane_rect.x -= speed
    if keys[pygame.K_RIGHT]:
        airplane_rect.x += speed
    if keys[pygame.K_UP]:
        airplane_rect.y -= speed
    if keys[pygame.K_DOWN]:
        airplane_rect.y += speed

    # Update peluru
    for b_rect in bullet_rects[:]:
        b_rect.move_ip(0, bullet_speed)
        if b_rect.bottom < 0:
            bullet_rects.remove(b_rect)
        elif b_rect.colliderect(enemy_rect) or b_rect.colliderect(enemy2_rect):
            if b_rect.colliderect(enemy_rect):
                enemy_rect.topleft = (random.randint(0, WIDTH - enemy_rect.width), 0 - enemy_rect.height)
            if b_rect.colliderect(enemy2_rect):
                enemy2_rect.topleft = (random.randint(0, WIDTH - enemy2_rect.width), 0 - enemy2_rect.height)
            bullet_rects.remove(b_rect)
            score += 1

    # Batasi gerakan pesawat
    if airplane_rect.left < 0:
        airplane_rect.left = 0
    if airplane_rect.right > WIDTH:
        airplane_rect.right = WIDTH
    if airplane_rect.top < 0:
        airplane_rect.top = 0
    if airplane_rect.bottom > HEIGHT:
        airplane_rect.bottom = HEIGHT

    # Gerakkan musuh
    enemy_rect.y += random.randint(1, 3)
    enemy2_rect.y += random.randint(1, 3)

    # Reset posisi musuh jika mereka lewat layar
    if enemy_rect.top > HEIGHT:
        enemy_rect.topleft = (random.randint(0, WIDTH - enemy_rect.width), 0 - enemy_rect.height)
    if enemy2_rect.top > HEIGHT:
        enemy2_rect.topleft = (random.randint(0, WIDTH - enemy2_rect.width), 0 - enemy2_rect.height)

    # Deteksi tabrakan dengan musuh
    if airplane_rect.colliderect(enemy_rect) or airplane_rect.colliderect(enemy2_rect):
        airplane_rect.centerx = WIDTH // 2
        airplane_rect.bottom = HEIGHT - 10
        score = 0  # Atau kamu bisa menambahkan game over screen di sini

    # Gambar semua elemen
    screen.blit(background, background_rect)
    screen.blit(enemy, enemy_rect)
    screen.blit(enemy2, enemy2_rect)
    screen.blit(airplane, airplane_rect)

    # Gambar bullet setelah objek lain
    for b_rect in bullet_rects:
        screen.blit(bullet, b_rect.topleft)

    score_display = font.render(f"Score: {score}", True, (255, 255, 255))
    screen.blit(score_display, (10, 10))

    pygame.display.flip()

clock.tick(60)

pygame.quit()
sys.exit()
