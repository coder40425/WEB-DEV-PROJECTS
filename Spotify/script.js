console.log("lets write java script")


let currentSong = new Audio; //global variables
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {  //to convert seconds to minutes
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
   // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }


     //show all the songs in the playlist
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
     songUL.innerHTML = ""  //to empty the ul, whenever we load different folder
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>  <img src="music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                            <span>Play Now</span>
                                <img src="play.svg" class="invert" alt="">
                            </div> </li>`;

    }
    //play the first song
    /* var audio = new Audio(songs[0]);
      audio.play(); */


    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
      // console.log(e)   //will give all the lis

        e.addEventListener("click", element => {

          //  console.log(e.querySelector("div").firstElementChild.innerHTML) //targetting first div of li (i.e info) & then its first div(firstchild) to get the song name.mp3
            playMusic(e.querySelector("div").firstElementChild.innerHTML.trim())
        })
    })
    return songs

}


const playMusic = (track, pause = false) => {
    let audio = new Audio(`${currFolder}` + track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg"   //when song starts, change play button to pause button
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {   //display all the albums on the page
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
   // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach(e=>{
        if(e.href.includes("/songs")){
          console.log(e.href.split("/").slice(-2)[0])
        }
    })
    console.log(anchors)
}

async function main() {

    //get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)   //when we randomly click the play button, a song should play

   //display all the albums on the page
    displayAlbums()

    //attach an event listener to play, next and previous.
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
      //  console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";   //to move the seekbar

    })

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        //console.log(e.target.getBoundingClientRect().width, e.offsetX) //gives where i clicked on the seekbar & its total width
        //console.log((e.offsetX / e.target.getBoundingClientRect().width)*100) //gives the percentage of where I clicked on the seekbar
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = (percent + "%")
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;  //to get the seconds as per the percentage of where the seekbar was clicked
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //add event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add an event listener to previous & next
    previous.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])  //get the index of the currentsong from list of songs
        if ((index + 1) >= 0) {   //if its not the first song
            playMusic(songs[index - 1]);
        }
        if ((index) == 0) {    //if we previous the first song, it will play the last song
            playMusic(songs[songs.length - 1])
        }

    })

    next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])  //get the index of the currentsong from list of songs
        if ((index + 1) < songs.length) {   //if its not the last song
            playMusic(songs[index + 1]);
        }
        if ((index) == songs.length - 1) {  //if we next the last song, it will play the first song
            playMusic(songs[0])
        }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
      console.log("setting volume to",e.target.value,"/ 100")  //e.target.value gives value of sound (0 to 100)
      currentSong.volume = parseInt(e.target.value)/100
    })

    //load the playlist whenever card is clicked
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
          //  console.log(item,item.currentTarget.dataset)  /* currentTarget -> to target the event for which the event is listened for */
            let folder = item.currentTarget.dataset.folder
            songs = await getSongs(`songs/${folder}`)
            playMusic(songs[0])
        })
    })
}

main()

