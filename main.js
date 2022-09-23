const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd =$('.cd')
const heading = $('header h2')
const cdThumbnail = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const app = {
    currentIndex: 0,
    isPlaying: false,
  songs: [
    {
      name: "Mặt Mộc",
      singer: "Phạm Nguyên Ngọc, Vanh, Ân Nhi, BMZ",
      path: "./asset/music/song1.mp3",
      image: "./asset/img/song1.png",
    },
    {
      name: "Vì Mẹ anh bắt chia tay",
      singer: "Miu Lê, Karik",
      path: "./asset/music/song2.mp3",
      image: "",
    },
    {
      name: "vaicaunoicokhiennguoithaydoi",
      singer: "GREY D, Tlinh",
      path: "./asset/music/song3.mp3",
      image: "",
    },
    {
      name: "đứa nào làm em buồn",
      singer: " Phúc Du, Hoàng Dũng",
      path: "./asset/music/song4.mp3",
    },
    {
      name: "Nhẫn Tâm Là Em",
      singer: " Nguyễn Trần Trung Quân",
      path: "./asset/music/song5.mp3",
    },
    {
      name: "có hẹn với thanh xuân",
      singer: "Suni Hạ Linh, Hoàng Dũng, GREY D, Orange, Tlinh",
      path: "./asset/music/song6.mp3",
    },
    {
      name: "lời tạm biệt chưa nói",
      singer: "GREY D, Orange",
      path: "./asset/music/song7.mp3",
      image: "",
    },
    {
      name: "Và Ngày Nào Đó",
      singer: "Trung Quân Idol",
      path: "./asset/music/song8.mp3",
      image: "",
    },
    {
      name: "Thế Giới Trong Em",
      singer: "Hương Ly",
      path: "./asset/music/song9.mp3",
      image: "",
    },
    {
      name: "Mình Hày Ngừng Lại Em Nhé",
      singer: "Văn Võ Ngọc Nhân",
      path: "./asset/music/song10.mp3",
      image: "",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
            <div class="song">
                <div
                    class="thumb"
                    style="
                    background-image: '${song.image}';
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
    }

    // Khi song isPaused (đang dừng hoặc chưa phát)
    audio.onpause = function () {
        _this.isPlaying = false
        player.classList.remove('playing')
    }

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
            progress.value = progressPercent
        }
    }
    // Tua bài hát

    progress.onchange = function (e) {
        const seekTime = (e.target.value*audio.duration)/100
        audio.currentTime = seekTime
    }

  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    
  },

  start: function () {
    //Định nghĩa các thuộc tính của ob
    this.defineProperties() 
    //Lắng nghe/ xử lý các sự kiện (DOM Event)
    this.handleEvent()

    //Tải thông tin bài hát đầu tiên vào UI

    this.loadCurrentSong()

    //Render Playlist
    this.render()
  },
}

app.start();
