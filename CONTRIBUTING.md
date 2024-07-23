# **Contributing Guidelines** 📄

This documentation contains a set of guidelines to help you during the contribution process.
We are happy to welcome all the contributions from anyone willing to improve/add new scripts to this project.
Thank you for helping out and remember, **no contribution is too small.**
<br>
Please note we have a [code of conduct](CODE_OF_CONDUCT.md)  please follow it in all your interactions with the project.



<br>

## **Need some help regarding the basics?🤔**


You can refer to the following articles on basics of Git and Github and also contact the Project Mentors,
in case you are stuck:

- [Forking a Repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
- [Cloning a Repo](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request)
- [How to create a Pull Request](https://opensource.com/article/19/7/create-pull-request-github)
- [Getting started with Git and GitHub](https://towardsdatascience.com/getting-started-with-git-and-github-6fcd0f2d4ac6)
- [Learn GitHub from Scratch](https://lab.github.com/githubtraining/introduction-to-github)

<br>

### Alternatively contribute using GitHub Desktop

1. **Open GitHub Desktop:**
   Launch GitHub Desktop and log in to your GitHub account if you haven't already.

2. **Clone the Repository:**
   - If you haven't cloned the GameZone repository yet, you can do so by clicking on the "File" menu and selecting "Clone Repository."
   - Choose the GameZone repository from the list of repositories on GitHub and clone it to your local machine.

3. **Switch to the Correct Branch:**
   - Ensure you are on the branch that you want to submit a pull request for.
   - If you need to switch branches, you can do so by clicking on the "Current Branch" dropdown menu and selecting the desired branch.

4. **Make Changes:**
   Make your changes to the code or files in the repository using your preferred code editor.

5. **Commit Changes:**
   - In GitHub Desktop, you'll see a list of the files you've changed. Check the box next to each file you want to include in the commit.
   - Enter a summary and description for your changes in the "Summary" and "Description" fields, respectively. Click the "Commit to <branch-name>" button to commit your changes to the local branch.

6. **Push Changes to GitHub:**
   After committing your changes, click the "Push origin" button in the top right corner of GitHub Desktop to push your changes to your forked repository on GitHub.

7. **Create a Pull Request:**
  - Go to the GitHub website and navigate to your fork of the GameZone repository.
  - You should see a button to "Compare & pull request" between your fork and the original repository. Click on it.

8. **Review and Submit:**
   - On the pull request page, review your changes and add any additional information, such as a title and description, that you want to include with your pull request.
   - Once you're satisfied, click the "Create pull request" button to submit your pull request.

9. **Wait for Review:**
    Your pull request will now be available for review by the project maintainers. They may provide feedback or ask for changes before merging your pull request into the main branch of the GameZone repository.

⭐️ Support the Project
If you find this project helpful, please consider giving it a star on GitHub! Your support helps to grow the project and reach more contributors.

## **Issue Report Process 📌**

1. Go to the project's issues.
2. Select the template that better fits your issue.
3. Give proper description for the issues.
4. Don't spam to get the assignment of the issue 😀.
5. Wait for till someone is looking into it !.
6. Start working on issue only after you got assigned that issue 🚀.

<br>

## **File naming conventions 📁**
- Give unique name for your game that is not already existed 
* Folder naming convention
    - ```Game_Name```  ex.  ```Tilting_Maze``` (first letter should be capital and if you need space use _ )  
* files in the folder 
    - ```index.html``` , ```script.js``` , ```style.css```(not stictly to follow this but you should have separate )
    - you can have other folders if you are having assets for your game 
    - ```README.md``` for your folder using template [TEMPLATE](../Games/FOLDER_README_TEMPLATE.md) 
    - It is not compulsory to follow this README template only you can have your own 
* naming convention for the screenshot you will add in ```assets/images```
    - name of image should be same as your game name
    - ex. ```Tilting_Maze.jpeg``` or .jpg or .png any of the image formate

<br>


## Add Game to assets/js/gamesData.json

* This is to Show your game on the main Website
   - Go to the end of gamesData.json and add :
   - **,**
         " **No.** ":{
            "gameTitle" : " **Title** ",
            "gameUrl": " **Main Folder** ",
            "thumbnailUrl":" **Preview Image** " 
         }
   - **No.**: Number for your Game , it should be the next number with respect to the file. eg: it the last no. in file at present is *625* you should put *626* at the place of **No.**
   - **Title:** this is the title for your game that will be shown on the website, if your game name is ```Super_Mario_Game``` ,put Title as ```Super Mario Game```
   - **Main Folder :** This is the reference to *index.html* 
      - if your index.html is directly in main game folder ,put the main folder name eg: ```Super_Mario_Game```
      - if your index.html is in subfolder , give path to it 
      eg: ```Super_Mario_Game/public``` (assuming index.html is in public folder of Super_Mario_Game folder)
      - if your main html file's name is not index.html , you need to specify the main html file also. eg:```Super_Mario_Game/mario.html``` or if in sub folder ```Super_Mario_Game/public/mario.html```
   - **Preview Image:** This is the image that will be shown as preview for your game , here you provide the name of the image that you added to **assets/images** folder, along with format type. Eg. ```Super_Mario_Game.png``` or ```Super_Mario_Game.jpg``` or with any other format.

**Note:-** 
   
   -  Do not modify anything else in the rest of the file, you only need to add your game in the end of the file. 
   - Don't forget to add the comma for new entry (already give in above sample but this is a reminder as one might miss it to see in the sample)
## **Pull Request Process 🚀**

1. Ensure that you have self reviewed your code 😀
2. Make sure you have added the proper description for the functionality of the code
3. You have added README file in your repository .
4. You have added the thumbnail of the project into ```assets/images``` for website preview
5. Add your game screenshot in the assets folder by following the proper conversion specified over here
6. You have added your game name and link in main README.md
7. Submit your PR by giving the necesarry information in PR template and hang tight we will review it really soon 🚀

<br>

# **Happy Hacking 💗** 

