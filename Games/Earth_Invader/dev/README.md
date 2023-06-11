Todo
=====
- [ ] Port game to phaser for 2099 edition
- [ ] Have expanded playing space, have it be same no matter what size screen (extend beyond bounds of screen)
- [ ] Upgrades, new enemy types, more varied enemy types, new powerups and weapons, different ships with different stats
- [ ] New gameplay (in atmosphere raids after taking down shields?)
- [ ] Have a server (heroku?) to show leaderboard stats
- [ ] Include gravity, use actual equation and have it affect all ships with each other and the planet
- [ ] Have damage be calculated as a force as well as special damage. F=ma, but acceleration would be hard to constantly calculate. Speed would be a decent approximation. So if player is moving 20 units, that speed will be added to the projectiles normal speed (parent velocity, prevents hitting one self), and each projectile will have a mass (area can be used to approximate) This means running towards enemies and firing, while risky, does more damage. On top of that, there will be the special damages/effects (fire burn, water electrocute, air push, rock penetrate)

Earth Invader - 2099 Edition
=====

![pic](public/assets/images/logo.png)

How to test
=====

Make sure you have node, and in this directory (path/to/earth-invader/dev) run node install. It will install the dependencies. 
