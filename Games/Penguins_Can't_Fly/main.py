import pygame
import random

pygame.init()
pygame.mixer.init() #for music and audio files in pygame
WIDTH=500
HEIGHT=650
fps=60 #sets the framerate-the number of times the timer ticks per second
timer=pygame.time.Clock()
font=pygame.font.Font(r"Terserah.ttf",24) #Font style and font size
huge_font=pygame.font.Font(r"Terserah.ttf",42) #Font style and font size
pygame.display.set_caption("Penguins Can't Fly")

screen=pygame.display.set_mode([WIDTH,HEIGHT])
bg=(135,206,235)
game_over=False
clouds=[[200,100,1],[50,330,2],[350,330,3],[200,500,1]]
cloud_images=[]
for i in range(1,4):
    img=pygame.image.load(f'cloud{i}.png') #loads new image from a file
    cloud_images.append(img)

player_x=240
player_y=40
penguin=pygame.transform.scale(pygame.image.load('penguin.png'),(50,50)) #scales the penguin to a new dimension
direction=-1
y_speed=0
gravity=0.2
x_speed=3
x_direction=0
score=0
total_distance=0
file=open('high_score.txt','r')
read=file.readlines()
first_high=int(read[0])
high_score=first_high
shark=pygame.transform.scale(pygame.image.load('jetpack_shark.png'),(300,200))
enemies=[[-234,random.randint(400,HEIGHT-100),1]] #the last value '1' specifies the direction of movement of the shark
pygame.mixer.music.load('theme.mp3') #Load a music file for playback
bounce=pygame.mixer.Sound('bounce.mp3') #Create a new Sound object from a file or buffer object
end_sound=pygame.mixer.Sound('game_over.mp3')
pygame.mixer.music.play()
pygame.mixer.music.set_volume(0.2)


def draw_clouds(cloud_list,images):
    platforms=[]
    for j in range(len(cloud_list)):
        image=images[cloud_list[j][2]-1]
        platform=pygame.rect.Rect((cloud_list[j][0]+5,cloud_list[j][1]+40),(120,10)) #displays the rectangle
        screen.blit(image,(cloud_list[j][0],cloud_list[j][1])) #displays the image drawn on the screen
        pygame.draw.rect(screen,'gray',[cloud_list[j][0]+5,cloud_list[j][1]+40,120,3])
        platforms.append(platform)
    return platforms

def draw_player(x_pos,y_pos,player_img,direc):
    if direc== -1:
        player_img=pygame.transform.flip(player_img,False,True) #flips image in the y-direction keeping it unchanged in the x-direction
    screen.blit(player_img,(x_pos,y_pos)) #draws the player_img onto the screen at the coordinates specified
    player_rect=pygame.rect.Rect((x_pos+7,y_pos+40),(36,10))
    #pygame.draw.rect(screen,'green',player_rect,3)
    return player_rect

def draw_enemies(enemy_list,shark_img):
    enemy_rects=[]
    for j in range(len(enemy_list)):
        enemy_rect=pygame.rect.Rect((enemy_list[j][0]+40,enemy_list[j][1]+50),(215,70))
        #pygame.draw.rect(screen,'orange',enemy_rect,3)
        enemy_rects.append(enemy_rect)
        if(enemy_list[j][2]==1):
            screen.blit(shark_img,(enemy_list[j][0],enemy_list[j][1]))
        elif(enemy_list[j][2]==-1):
            screen.blit(pygame.transform.flip(shark_img,1,0),(enemy_list[j][0],enemy_list[j][1]))
    return enemy_rects

def move_enemies(enemy_list,current_score):
    enemy_speed=2+current_score//15
    for j in range(len(enemy_list)):
        if(enemy_list[j][2]==1):
            if(enemy_list[j][0]<WIDTH):
                enemy_list[j][0]+=enemy_speed #increase the x_coord if still on the screen
            else:
                enemy_list[j][2]=-1 #reverse the direction if off the screen
        elif(enemy_list[j][2]==-1):
            if(enemy_list[j][0]>-235):
                enemy_list[j][0]-=enemy_speed #increase the x_coord if still on the screen
            else:
                enemy_list[j][2]=1 #reverse the direction if off the screen
        if(enemy_list[j][1]<-100):
            enemy_list[j][1]=random.randint(HEIGHT,HEIGHT+500) #if the shark goes offscreen in the vertical direction, make a new shark beneath the screen
    return enemy_list,current_score

def update_objects(cloud_list,play_y,enemy_list):
    lowest_cloud=0
    update_speed=5
    if play_y>200:
        play_y-=update_speed #moves the player up as well as the clouds up so that it seems that the surrounding is falling
        for q in range(len(enemy_list)):
            enemy_list[q][1]-=update_speed
        for j in range(len(cloud_list)):
            cloud_list[j][1]-=update_speed
            if(cloud_list[j][1]>lowest_cloud):
                lowest_cloud=cloud_list[j][1]
        
        if lowest_cloud<600: #randomly generate one or two clouds
            num_clouds=random.randint(1,2)
            if num_clouds==1:
                x_pos=random.randint(0,WIDTH-70)
                y_pos=random.randint(HEIGHT+100,HEIGHT+300)
                cloud_type=random.randint(1,3)
                cloud_list.append([x_pos,y_pos,cloud_type])
            else:
                x_pos=random.randint(0,WIDTH//2-70) #also ensure that the two clouds generated don't overlap with each other
                y_pos=random.randint(HEIGHT+100,HEIGHT+300)
                cloud_type=random.randint(1,3)
                cloud_list.append([x_pos,y_pos,cloud_type])

                x_pos2=random.randint(WIDTH//2+70,WIDTH-70)
                y_pos2=random.randint(HEIGHT+100,HEIGHT+300)
                cloud_type2=random.randint(1,3)
                cloud_list.append([x_pos2,y_pos2,cloud_type2])
    return play_y,cloud_list,enemy_list


run=True
while run:
    screen.fill(bg)
    timer.tick(fps)
    cloud_platforms=draw_clouds(clouds,cloud_images)
    player=draw_player(player_x,player_y,penguin,direction)
    enemy_boxes=draw_enemies(enemies,shark)
    enemies,score=move_enemies(enemies,score)
    player_y,clouds,enemies=update_objects(clouds,player_y,enemies)
    if game_over:
        player_y=-300
        end_text=huge_font.render('Penguins can\'t Fly',True,'black') #draw text on a new Surface
        end_text2=font.render('Game Over: Press Enter to Restart',True,'black')
        screen.blit(end_text,(70,20))
        screen.blit(end_text2,(60,80))
        y_speed=0

    for i in range(len(cloud_platforms)): #the collsion detection
        if direction== -1 and player.colliderect(cloud_platforms[i]):
            y_speed*=-1 #reverses the direction of the penguin
            if y_speed>-2: #keeps a minimum speed of -2
                y_speed=-2
            bounce.play()


    for event in pygame.event.get(): #get events from the queue
        if event.type==pygame.QUIT:
            run=False
        if event.type==pygame.KEYDOWN: #a key is pressed
            if event.key==pygame.K_LEFT: #left arrow is pressed
                x_direction=-1
            elif event.key==pygame.K_RIGHT: #right arrow is pressed
                x_direction=1
            if event.key==pygame.K_RETURN and game_over:
                game_over=False
                player_x=240
                player_y=40
                direction=-1
                y_speed=0
                x_direction=0
                score=0
                total_distance=0
                enemies=[[-234,random.randint(400,HEIGHT-100),1]]
                clouds=[[200,100,1],[50,330,2],[350,330,3],[200,500,1]]
                pygame.mixer.music.play()
        
        if event.type==pygame.KEYUP: #a key is released
            if event.key==pygame.K_LEFT:
                x_direction=0
            elif event.key==pygame.K_RIGHT:
                x_direction=0
    
    if(y_speed<5 and not game_over):
        y_speed+=gravity #increases the speed in the y-direction
    player_y+=y_speed #increases the y-position of the penguin
    if(y_speed<0):
        direction=1 #if the y-speed is negative penguin is going up
    else:
        direction=-1 #else down
    player_x+=x_speed*x_direction
    if player_x>WIDTH: #handles the case when the penguin goes off screen in the x-direction
        player_x=-30
    elif player_x<-50:
        player_x=WIDTH-20

    for i in range(len(enemy_boxes)):
        if player.colliderect(enemy_boxes[i]) and not game_over:
            end_sound.play()
            game_over=True
            if(score>first_high):
                file=open('high_score.txt','w')
                write_score=str(score)
                file.write(write_score)
                file.close()
                first_high=score

    total_distance+=y_speed
    score=round(total_distance/100)
    score_text=font.render(f'Score: {score}',True,'black')
    screen.blit(score_text,(10,HEIGHT-70))
    high_score=max(score,high_score)
    score_text2=font.render(f'High Score: {high_score}',True,'black')
    screen.blit(score_text2,(10,HEIGHT-40))

    pygame.display.flip() #Update the full display Surface to the screen
pygame.quit()

