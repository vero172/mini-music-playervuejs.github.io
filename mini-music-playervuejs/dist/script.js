/*
design by Voicu Apostol.
design: https://dribbble.com/shots/3533847-Mini-Music-Player
I can't find any open music api or mp3 api so i have to download all musics as mp3 file.
You can fork on github: https://github.com/muhammederdem/mini-player
*/

new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "1",
          artist: "A",
          cover: "1.jpg",
          source: "1.mp3",
          url: "https://www.youtube.com/watch?v=7_HIEQRp_ZI",
          favorited: false
        },
        {
          name: "2",
          artist: "B",
          cover: "2.jpg",
          source: "2.mp3",
          url: "https://www.youtube.com/watch?v=iYYRH4apXDo",
          favorited: true
        },
        {
          name: "3",
          artist: "C",
          cover: "3.jpg",
          source: "3.mp3",
          url: "https://www.youtube.com/watch?v=eghcU95MVUI",
          favorited: false
        },
        {
          name: "4",
          artist: "D",
          cover: "4.jpg",
          source: "4.mp3",
          url: "https://www.youtube.com/watch?v=JQ4mFaI17pk",
          favorited: false
        },
        {
          name: "5",
          artist: "F",
          cover: "5.jpg",
          source: "5.mp3",
          url: "https://www.youtube.com/watch?v=52Gg9CqhbP8&list=RDGMEMQ1dJ7wXfLlqCjwV0xfSNbA&start_radio=1&rv=iYYRH4apXDo",
          favorited: true
        },
        {
          name: "6",
          artist: "G",
          cover: "6.jpg",
          source: "6.mp3",
          url: "https://www.youtube.com/watch?v=2IL7uIO9qGU",
          favorited: false
        },
        {
          name: "7",
          artist: "H",
          cover: "7.jpg",
          source: "7.mp3",
          url: "https://www.youtube.com/watch?v=feDs1pIhTFQ",
          favorited: true
        },
        {
          name: "8",
          artist: " I",
          cover: "8.jpg",
          source: "8.mp3",
          url: "https://www.youtube.com/watch?v=53vw9miqxAk",
          favorited: false
        },
        {
          name: "9",
          artist: "J",
          cover: "5.jpg",
          source: "9.mp3",
          url: "https://www.youtube.com/watch?v=CtvxNJHCrCc",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});