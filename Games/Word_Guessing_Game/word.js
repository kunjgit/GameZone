const wordlist = [
    {
        word: "apple",
        hint: "A Fruit"
    },
    {
        word : "python",
        hint : "A Programming Language"
    },
    {
        word : "golang",
        hint : "A Programming Language"
    },
    {
        word : "sun",
        hint : "A Star"
    },
    {
        word : "venus",
        hint : "A Planet"
    },
    {
        word : "aim",
        hint : "A Goal or Purpose"
    },
    {
        word : "gold",
        hint : "A Yellow Precious Metal"
    },
    {
        word : "guitar",
        hint : "A Musical Instrument"
    },
    {
        word : "idea",
        hint : "A Thought or Suggestion"
    },
    {
        word : "joke",
        hint : "A thing that someone says to cause amusement"
    },
    {
        word : "search",
        hint : "Try to find Something"
    },
    {
        word : "jpeg",
        hint : "An Image File Format"
    },
    {
        word : "moon",
        hint : "Earth's Satellite"
    },
    {
        word : "gamezone",
        hint : "A Place to play Games at this instant"
    },
    {   
        word : "india",
        hint : "Our Loved Country"
    },
    {
        word : "venice",
        hint : "City of Waters"
    },
    {
        word : "japan",
        hint : "Country of Rising Sun"
    },
    {
        word : "dialogue",
        hint : "A conversation between two or more people"
    },
    {
        word : "edible",
        hint : "Something suitable to be eaten"
    },
    {
        word : "behavior",
        hint : "The way that someone behaves"
    },
    {
        word : "blood" ,
        hint : "Red liquid that flows in our body"
    },
    {
        word : "danger",
        hint : "The possibility of harm or death to someone"
    },
    {
        word : "disease",
        hint : "An illness of people"
    },
    {
        word : "hate",
        hint : "To dislike someone"
    },
    {
        word : "hour",
        hint : "A period of 60 minutes"
    },
    {
        word : "level",
        hint : "The height of something"
    },
    {
        word : "owner",
        hint : "Someone who owns something"
    },
    {
        word : "punishment",
        hint : "The act of punishing someone"
    },
    {
        word : "way",
        hint : "A route, direction"
    },
    {
        word : "Sick",
        hint : "Condition of not feeling well"
    },      //Abstract
    {
        word: "Happiness",
        hint: "Emotion of joy and contentment"
    },
    {
        word: "Adventure",
        hint: "Exciting or unusual experience"
    },
    {
        word: "Persistence",
        hint: "Continuance in a course of action despite obstacles"
    },
    {
        word: "Serenity",
        hint: "State of calmness and tranquility"
    },
    {
        word: "Curiosity",
        hint: "Desire to learn or know about something"
    },
    {
        word: "Resilience",
        hint: "Ability to recover from difficulties"
    },
    {
        word: "Harmony",
        hint: "Agreement or accord"
    },
    {
        word: "Creativity",
        hint: "Ability to generate new ideas or concepts"
    },
    {
        word: "Compassion",
        hint: "Sympathetic concern for others' distress"
    },
    {
        word: "Diversity",
        hint: "Variety or range of differences within a group"
    },
    {           //Physical Objects
        word: "Mountain",
        hint: "A large natural elevation of the earth's surface rising abruptly from the surrounding level"
    },
    {
        word: "Ocean",
        hint: "A vast body of salt water that covers almost three-quarters of the Earth's surface"
    },
    {
        word: "Tree",
        hint: "A woody perennial plant, typically having a single stem or trunk growing to a considerable height"
    },
    {
        word: "Sunset",
        hint: "The daily disappearance of the sun below the horizon"
    },
    {
        word: "River",
        hint: "A large natural stream of water flowing in a channel to the sea, a lake, or another such stream"
    },
    {
        word: "Rainbow",
        hint: "A meteorological phenomenon that is caused by reflection, refraction and dispersion of light in water droplets resulting in a spectrum of light appearing in the sky"
    },
    {
        word: "Rock",
        hint: "Solid mineral material forming part of the surface of the earth"
    },
    {
        word: "Flower",
        hint: "The seed-bearing part of a plant, consisting of reproductive organs that are typically surrounded by a brightly colored corolla"
    },
    {
        word: "Cloud",
        hint: "A visible mass of condensed water vapor floating in the atmosphere"
    },
    {
        word: "Volcano",
        hint: "A mountain or hill, typically conical, having a crater or vent through which lava, rock fragments, hot vapor, and gas are being or have been erupted from the earth's crust"
    },          //Animals
    {
        word: "Elephant",
        hint: "A large mammal with a long trunk and tusks, native to Africa and parts of Asia"
    },
    {
        word: "Tiger",
        hint: "A large carnivorous feline mammal with a striped coat, native to Asia"
    },
    {
        word: "Lion",
        hint: "A large carnivorous feline mammal of Africa and NW India, with a short tawny coat, a tufted tail, and, in the male, a heavy mane around the neck and shoulders"
    },
    {
        word: "Giraffe",
        hint: "A large African mammal with a very long neck and forelegs, having a coat patterned with brown patches separated by lighter lines"
    },
    {
        word: "Penguin",
        hint: "A large flightless seabird of the Southern Hemisphere, with black upper parts and white underparts and wings developed into flippers for swimming underwater"
    },
    {
        word: "Dolphin",
        hint: "A small gregarious toothed whale that typically has a beaklike snout and a curved fin on the back"
    },
    {
        word: "Eagle",
        hint: "A large bird of prey with a massive hooked bill and long broad wings, renowned for its keen sight and powerful soaring flight"
    },
    {
        word: "Kangaroo",
        hint: "A large plant-eating marsupial with a long powerful tail and strongly developed hind limbs that enable it to leap"
    },
    {
        word: "Bear",
        hint: "A large, heavy mammal that walks on the soles of its feet, having thick fur and a very short tail"
    },
    {
        word: "Whale",
        hint: "A very large marine mammal with a streamlined hairless body, a horizontal tail fin, and a blowhole on top of the head for breathing"
    },
    {       //Physics Stuffs
        word: "Gravity",
        hint: "A force of attraction between objects with mass"
    },
    {
        word: "Energy",
        hint: "The capacity to do work or produce heat"
    },
    {
        word: "Velocity",
        hint: "The rate of change of an object's position with respect to a frame of reference"
    },
    {
        word: "Acceleration",
        hint: "The rate of change of velocity with respect to time"
    },
    {
        word: "Electricity",
        hint: "A form of energy resulting from the existence of charged particles"
    },
    {
        word: "Momentum",
        hint: "The quantity of motion of a moving body, measured as a product of its mass and velocity"
    },
    {
        word: "Friction",
        hint: "The force resisting the relative motion of solid surfaces, fluid layers, and material elements sliding against each other"
    },
    {
        word: "Wave",
        hint: "A disturbance that transfers energy through matter or space"
    },
    {
        word: "Frequency",
        hint: "The number of occurrences of a repeating event per unit of time"
    },
    {
        word: "Inertia",
        hint: "The tendency of an object to resist changes in its state of motion"
    },
    {
        word: "Algorithm",
        hint: "A set of rules or instructions designed to solve a specific problem or perform a particular task"
    },
    {
        word: "Variable",
        hint: "A symbolic name associated with a value that may change during the execution of a program"
    },
    {
        word: "Function",
        hint: "A self-contained block of code that performs a specific task"
    },
    {
        word: "Loop",
        hint: "A control flow statement that allows code to be executed repeatedly"
    },
    {
        word: "Array",
        hint: "A data structure that stores a collection of elements, typically of the same type, in contiguous memory locations"
    },
    {
        word: "Class",
        hint: "A blueprint for creating objects, providing initial values for state (member variables) and implementations of behavior (member functions or methods)"
    },
    {
        word: "Debugging",
        hint: "The process of identifying and fixing errors or bugs in a computer program"
    },
    {
        word: "Interface",
        hint: "A contract defining the methods that a class must implement"
    },
    {
        word: "Recursion",
        hint: "A programming technique in which a function calls itself directly or indirectly"
    },
    {
        word: "Syntax",
        hint: "The set of rules that defines the combinations of symbols that are considered to be correctly structured"
    }// Add more words and hints here...
    ]
    