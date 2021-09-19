const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,    
    isRepeat: false,
    songs: [
        {
            name: 'Never Gonna Give You Up2',
            singer: 'Rick Astley2',
            path: './assets/music/y2mate.com - Onii  Chan Baka .mp3',
            image: './assets/image/Rick Roll.jpg'
        },
        {
            name: 'KANABOON  Silhouette',
            singer: 'KANABOON offcial',
            path: './assets/music/y2mate.com - KANABOON  Silhouette.mp3',
            image: './assets/image/KANA-BOON-s-KB_massara_a-sya.jpg'
        },
        {
            name: 'Magic! - Rude',
            singer: 'Magic',
            path: './assets/music/y2mate.com - MAGIC  Rude Official Video.mp3',
            image: './assets/image/Magic rude.jpg'
        },
        {
            name: 'Powfu - death bed',
            singer: 'Powfu',
            path: './assets/music/y2mate.com - Powfu  death bed coffee for your head Official Video ft beabadoobee.mp3',
            image: './assets/image/Powfu - deathbed.jpg' 
        },
        {
            name: 'The Chainsmokers & Coldplay',
            singer: 'The Chainsmokers',
            path: './assets/music/y2mate.com - The Chainsmokers  Coldplay  Something Just Like This Extended Radio Edit.mp3',
            image: './assets/image/the chainsmokers .jpg'
        },
        {
            name: 'YOASOBI',
            singer: 'Ayase',
            path: './assets/music/y2mate.com - YOASOBIたふんOfficial Music  Video.mp3',
            image: './assets/image/YOASOBI.jpg'
        },
        {
            name: 'Loser',
            singer: '米津玄師',
            path: './assets/music/y2mate.com - 米津玄師 MVLOSER.mp3',
            image: './assets/image/loser.jpg'
        }, 
        {
            name: 'Kenshi Yonezu Peace',
            singer: 'Kenshi Yonezu',
            path: './assets/music/y2mate.com - 米津玄師 MVピースサインKenshi Yonezu  Peace Sign.mp3',
            image: './assets/image/kenshi.jpg'
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
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
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        
        cdThumbAnimate.pause()

        // Xử lí phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lí khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {  
                audio.pause()
            } else {
                audio.play()            
            }
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            } 
        }

        // Xử lí khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next song 
        nextBtn.onclick = function() {
            if (_this.isRamdom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev song 
        prevBtn.onclick = function() {
            if (_this.isRamdom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lí Ramdom songs bật / tắt
        randomBtn.onclick = function(e) {
            _this.isRamdom = !_this.isRamdom
            randomBtn.classList.toggle('active', _this.isRamdom)
        }

        // Xử lí phát lại một song bật / tắt
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lí next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                // Xử lí khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lí khi click vào song options
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    loadCurrentSong: function() {  
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe và xử lý các sự kiện (DOM Event)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        
        // Render playlist
        this.render()
    }
}

app.start()
