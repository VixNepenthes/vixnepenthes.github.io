const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'VI-PLAYER'
const player = $('.player')
const cd =$('.cd')
const heading = $('header h2')
const cdThumbnail = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const timerDuration = $('.timer-duration')
const timerCurrent = $('.timer-current')
let songPlayed = [0]
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Mặt Mộc",
      singer: "Phạm Nguyên Ngọc, Vanh, Ân Nhi, BMZ",
      path: "./asset/music/song1.mp3",
      image: "./asset/img/song1.png",
    },
    {
      name: "Vì mẹ anh bắt chia tay",
      singer: "Miu Lê, Karik",
      path: "./asset/music/song2.mp3",
      image: "./asset/img/song2.png",
    },
    {
      name: "vaicaunoicokhiennguoithaydoi",
      singer: "GREY D, Tlinh",
      path: "./asset/music/song3.mp3",
      image: "./asset/img/song3.png",
    },
    {
      name: "đứa nào làm em buồn",
      singer: " Phúc Du, Hoàng Dũng",
      path: "./asset/music/song4.mp3",
      image: "./asset/img/song4.png",

    },
    {
      name: "Nhẫn Tâm Là Em",
      singer: " Nguyễn Trần Trung Quân",
      path: "./asset/music/song5.mp3",
      image: "./asset/img/song5.png",

    },
    {
      name: "có hẹn với thanh xuân",
      singer: "Suni Hạ Linh, Hoàng Dũng, GREY D, Orange, Tlinh",
      path: "./asset/music/song6.mp3",
      image: "./asset/img/song6.png",
    },
    {
      name: "lời tạm biệt chưa nói",
      singer: "GREY D, Orange",
      path: "./asset/music/song7.mp3",
      image: "./asset/img/song7.png",
    },
    {
      name: "Và Ngày Nào Đó",
      singer: "Trung Quân Idol",
      path: "./asset/music/song8.mp3",
      image: "./asset/img/song8.png",
      
    },
    {
      name: "Thế Giới Trong Em",
      singer: "Hương Ly",
      path: "./asset/music/song9.mp3",
      image: "./asset/img/song9.png",
    },
    {
      name: "Mình Hày Ngừng Lại Em Nhé",
      singer: "Văn Võ Ngọc Nhân",
      path: "./asset/music/song10.mp3",
      image: "./asset/img/song10.png",

    },
    {
      name: "The Last Goodbye",
      singer: "Nguyễn Trần Trung Quân",
      path: "./asset/music/song11.mp3",
      image: "./asset/img/song11.png",
    },
  ],
  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div
                    class="thumb"
                    style="
                    background-image: url('${song.image}');
                    "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
            `
    })
    $('.playlist').innerHTML = htmls.join('')
  },
  defineProperties: function () {
    Object.defineProperty(this,'currentSong', {
        get: function () {
            return this.songs[this.currentIndex]
        }
    })
  },
  handleEvent: function () {
    const cdWidth = cd.offsetWidth
    const _this = this

    // Xử lý CD quay
    const cdThumbnailAnimate = cdThumbnail.animate([
        {transform: 'rotate(360deg)'}
    ], {
        duration: 10000, //10 seconds
        iterations: Infinity
    })

    cdThumbnailAnimate.pause()
    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = () => {
       const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
       const newCdWidth = cdWidth - scrollTop
       cd.style.width = newCdWidth>0 ? newCdWidth +'px': 0
       cd.style.opacity = newCdWidth / cdWidth
    }

    // Xử lí khi click play
    playBtn.onclick = function() {
        if(_this.isPlaying) {
            audio.pause()  
        } else { 
        audio.play()
        }
        
    }

    // Khi song isPlaying (đang phát)
    audio.onplay = function (){
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbnailAnimate.play()
        let minutes = (audio.currentTime)/60
        let seconds = (audio.currentTime) % 60
        timerDuration.textContent = minutes +':'+ seconds
    }

    // Khi song isPaused (đang dừng hoặc chưa phát)
    audio.onpause = function () {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbnailAnimate.pause()

    }

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
            progress.value = progressPercent
        }
        // Xử lý tiến độ
        const minutesCurrent =
          Math.floor(audio.currentTime / 60) <= 9
            ? '0' + Math.floor(audio.currentTime / 60)
            : Math.floor(audio.currentTime / 60);
        const secondsCurrent =
          Math.floor(audio.currentTime - minutesCurrent * 60) <= 9
            ? '0' + Math.floor(audio.currentTime - minutesCurrent * 60)
            : Math.floor(audio.currentTime - minutesCurrent * 60);
        const minutesDuration =
          Math.floor(audio.duration / 60) <= 9
            ? '0' + Math.floor(audio.duration / 60)
            : Math.floor(audio.duration / 60);
        const secondsDuration =
          Math.floor(audio.duration - minutesDuration * 60) <= 9
            ? '0' + Math.floor(audio.duration - minutesDuration * 60)
            : Math.floor(audio.duration - minutesDuration * 60);
        timerCurrent.innerText = minutesCurrent + ':' + secondsCurrent;
        timerDuration.innerText = minutesDuration + ':' + secondsDuration;
    }
    // Tua bài hát

    progress.oninput = function (e) {
        const seekTime = (e.target.value*audio.duration)/100
        audio.currentTime = seekTime
    }

    // Khi nextSong Button CLicked
    nextBtn.onclick = function () {
      if(_this.isRandom){
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }
        _this.render()
        _this.scrollToActiveSong()
        audio.play()
    }

    // Khi preSong Button CLicked
    prevBtn.onclick = function () {
      if(_this.isRandom){
        _this.playRandomSong()
      } else {
        _this.preSong()
      }
        _this.render()
        _this.scrollToActiveSong()
        audio.play()
    }

    // Khi Random bài hát
    randomBtn.onclick = function () {
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom', _this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)
        
    }

    // Khi repeat bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      _this.setConfig('isRepeat', _this.isRepeat)
      repeatBtn.classList.toggle('active', _this.isRepeat)
    }

    // Khi bài hát kết thúc
    audio.onended = function () {
      if(_this.isRepeat){
        audio.play()
      } else{
        nextBtn.click()
      }
    }

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active')
      
      
      if(songNode || e.target.closest('.option')){
        // Xử lí khi click vào song
        if(songNode){
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()

        }
      }
    }   

  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    
    
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },

  scrollToActiveSong : function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: this.currentIndex < 2 ? "end" : "center",
      });
    }, 500)
  },

  nextSong: function () {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  preSong: function () {
    this.currentIndex--;
    if(this.currentIndex < 0){
        this.currentIndex = this.songs.length-1
    }
    this.loadCurrentSong()
  }, 

  playRandomSong: function () {
    
    // Tạo biến ngẫu nhiên

    let randIndex
    // Cho chạy vòng do while tìm số ngẫu nhiên mà không trùng với danh sách nhạc đã phát
    do {
      randIndex = Math.floor(Math.random() * this.songs.length)
    } while(songPlayed.includes(randIndex) === true)
    // Sau đó gán bài hát cho bài hiện tại
    this.currentIndex = randIndex
    // đưa bài hát hiện tại vào danh sách nhạc đã phát
    songPlayed.push(this.currentIndex)
    // Khi danh sách nhạc đã phát bằng số lượng nhạc thì clear danh sách đã phát
    if(songPlayed.length == this.songs.length -1) {
      songPlayed = []
    }

    this.loadCurrentSong()

  },

  

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig()

    //Định nghĩa các thuộc tính của ob
    this.defineProperties() 
    
    //Lắng nghe/ xử lý các sự kiện (DOM Event)
    this.handleEvent()

    //Tải thông tin bài hát đầu tiên vào UI

    this.loadCurrentSong()

    //Render Playlist
    this.render()

    // Hiển thị trạng thái ban đầu của button repeat & random
    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)

  },
}

app.start();
