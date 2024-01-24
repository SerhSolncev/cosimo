document.addEventListener('DOMContentLoaded', (event) => {

  const getElement = (context, selector) => {
    if (!context && !selector) {
      return null;
    }

    return context.querySelector(selector);
  };

  document.body.classList.add('loading');

  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500)

  // "modernizr" func"
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }

  // lazy-load
  const el = document.querySelectorAll('.lazy');
  window.observer = lozad(el);
  window.observer.observe();

  // proccess slider
  const processSlider = document.querySelectorAll('[data-slider="process-slider"]');
  if(processSlider !== null) {

    processSlider.forEach((el) => {
      const processSwiper = new Swiper(el.querySelector('.swiper-container'), {
        freeMode: false,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        simulateTouch: true,
        centeredSlides: true,
        lazy: {
          loadOnTransitionStart: true,
          loadPrevNextAmount: 2,
          loadPrevNext: true
        },
        loop: true,
        speed: 200,
        slidesPerView: 1,
        slidesPerGroup: 1,
        followFinger: true,
        spaceBetween: 20,
        on: {
          afterInit: (event) => {

          },

        },
        navigation: {
          nextEl: getElement(el.closest('[data-slider="process-slider"]'), '.js-next'),
          prevEl: getElement(el.closest('[data-slider="process-slider"]'), '.js-prev'),
          disabledClass: 'swiper-lock'
        },
        pagination: {
          el: el.querySelector('.swiper-pagination'),
          clickable: true,
          type: 'progressbar'
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 8
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          960: {
            slidesPerView: 3,
            spaceBetween: 8,
          }
        },
      });

      // nav position
      function updateBlockWidth() {
        var block1 = el.querySelector(".swiper-slide-active");
        var block2 = el.querySelector(".process-block__nav");

        var block1Width = parseFloat(window.getComputedStyle(block1).width);

        block2.style.width = block1Width + 44 + 'px';
      }

      updateBlockWidth();
      window.addEventListener('resize', updateBlockWidth);
      processSwiper.on('resize', function () {
        setTimeout(() => {
          updateBlockWidth();
        }, 200)
      })
    })
  }

  // testimonials slider
  const testimonialsSlider = document.querySelectorAll('[data-slider="testimonials-slider"]');
  if(testimonialsSlider !== null) {

    testimonialsSlider.forEach((el) => {
      const testimonialsSwiper = new Swiper(el.querySelector('.swiper-container'), {
        freeMode: false,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        simulateTouch: true,
        centeredSlides: true,
        lazy: {
          loadOnTransitionStart: true,
          loadPrevNextAmount: 2,
          loadPrevNext: true
        },
        loop: true,
        speed: 500,
        slidesPerView: 1,
        slidesPerGroup: 1,
        followFinger: true,
        spaceBetween: 8,
        on: {
          afterInit: (event) => {

          },
          slideChange: (event) => {

          },
          slideChangeTransitionEnd: (event) => {
            el.querySelectorAll('.js-sentense').forEach((sent) => {
              if(sent.classList.contains('done')) {
                sent.querySelectorAll('span').forEach((span, index) => {
                  span.style.color = '#b8b2cd';
                })
                sent.classList.add('repeat')
              }
            })
            setTimeout(() => {
              startColoring()
            }, 500)
          },
        },
        navigation: {
          nextEl: getElement(el.closest('[data-slider="testimonials-slider"]'), '.js-next'),
          prevEl: getElement(el.closest('[data-slider="testimonials-slider"]'), '.js-prev'),
          disabledClass: 'swiper-lock'
        },
        pagination: {
          el: el.querySelector('.swiper-pagination'),
          clickable: true,
          type: 'progressbar'
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 8
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 8,
          },
          960: {
            slidesPerView: 1,
            spaceBetween: 8,
          }
        },
      });
    })
  }

  // move top-block image
  const section = document.querySelector('.js-top-block');
  const image = document.querySelector('.js-move-image');

  if (!isTouchDevice()) {

    function updateImagePosition(e) {
      const rect = section.getBoundingClientRect();
      const centerX = rect.left + rect.width / 8;
      const centerY = rect.top + rect.height / 1.7;

      const diffX = e.clientX - centerX;
      const diffY = e.clientY - centerY;
      const delay = 0.4 * 1000; // 0.2 seconds delay

      setTimeout(function() {
        image.style.transform = `translate(${diffX}px, ${diffY}px)`;
      }, delay);
      image.style.transition = 'none'
    }

    section.addEventListener('mousemove', updateImagePosition);
    window.addEventListener('resize', updateImagePosition);
  } else {
    image.classList.add('mobile')
  }

  section.addEventListener('mouseleave', (e) => {
    image.style.transform = 'translate(110%, -50%)';
    image.style.transition = 'transform 0.2s linear'
  })

  // inview

  const blocks = document.querySelectorAll('.js-inview');
  let visib = true;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        entry.target.classList.add('visible');
        if(entry.target.classList.contains('js-number-block')) {
          document.querySelectorAll('.js-number-block').forEach(block => {
            const targetValue = parseInt(block.querySelector('.js-number').getAttribute('data-target'));
            const duration = 3000;
            const numberElement = block.querySelector('.js-number');
            console.log(block.classList);
            animateNumber(targetValue, duration, numberElement);
          });
        }

        if(entry.target.classList.contains('js-sentense')) {
          if(visib) {
            const words = splitWords(entry.target.textContent);
            entry.target.textContent = '';

            words.forEach((word, index) => {
              const wordElement = createWordElement(word);
              entry.target.appendChild(wordElement);

              setTimeout(() => {
                wordElement.style.color = '#1f0f58';
              }, index * 100);
            });
            visib = false
          }

        }

      } else {

      }
    });
  }, { threshold: 0.5 });

  blocks.forEach(block => observer.observe(block));

  // wave animation
  // animate nubmer
  function animateNumber(targetValue, duration, element) {
    const startValue = 0;
    const increment = (targetValue - startValue) / (duration / 16);

    function updateNumber(currentValue) {
      element.textContent = Math.round(currentValue);
    }

    function step(currentValue) {
      if (currentValue <= targetValue) {
        updateNumber(currentValue);
        setTimeout(() => step(currentValue + increment), 16);
      } else {
        updateNumber(targetValue);
      }
    }

    step(startValue);
  }

  // review sentense
  function splitWords(sentence) {
    return sentence.split(/\s+/);
  }

  function createWordElement(word) {
    const container = document.createElement('span');
    container.classList.add('word-container');
    container.textContent = word;
    return container;
  }

  function startColoring() {
    const sentenceElement = document.querySelectorAll('.js-sentense');
    sentenceElement.forEach((el) => {
      if(!el.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
        el.querySelectorAll('span').forEach((span, index) => {
          setTimeout(() => {
            span.style.color = '#b8b2cd';
          }, index * 100);
        })
      }
      if(el.closest('.swiper-slide') !== null && el.closest('.swiper-slide').classList.contains('swiper-slide-active') && !el.classList.contains('js-inview') && !el.classList.contains('done')) {
        const words = splitWords(el.textContent);
        el.textContent = '';

        words.forEach((word, index) => {
          const wordElement = createWordElement(word);
          el.appendChild(wordElement);

          setTimeout(() => {
            wordElement.style.color = '#1f0f58';
          }, index * 100);
          el.classList.add('done')
        });
      } else if (el.classList.contains('repeat') && el.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
          el.querySelectorAll('span').forEach((span, index) => {
            setTimeout(() => {
              span.style.color = '#1f0f58';
            }, index * 100);
          })
      }
    })
  }

  // accordions

  const buttons = document.querySelectorAll('.js-open-acc');
  const contents = document.querySelectorAll('.js-acc-block');

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Toggle the max-height property for smooth animation
      contents[index].style.maxHeight = contents[index].style.maxHeight ? null : contents[index].scrollHeight + "px";

      // Toggle the active class for the button
      button.closest('.values-item').classList.toggle('active');
    });
  });

  // pseudo select
  document.querySelectorAll('.js-custom-select').forEach((select) => {
    const selectBox = select.querySelector('.js-select-box');
    const dropdownContent = select.querySelector('.dropdown-content');
    const hiddenInput = select.querySelector('.hidden-input');

    selectBox.addEventListener('click', () => {
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';

      if(dropdownContent.style.display === 'block') {
        select.classList.add('open')
      }
    });

    dropdownContent.addEventListener('click', (e) => {
      if (e.target.classList.contains('dropdown-option')) {
        const selectedValue = e.target.getAttribute('data-value');
        selectBox.querySelector('.select-box__text').textContent = selectedValue;
        hiddenInput.value = selectedValue;
        select.classList.remove('open')
        dropdownContent.style.display = 'none';
      }
    });
  })

  // send form

  document.getElementById('js-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var inputs = this.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
      input.classList.remove('error');
      if(input.classList.contains('hidden-input')) {
        input.closest('.js-custom-select').classList.remove('error');
      }
    });

    var isValid = true;
    inputs.forEach(function(input) {
      if (!input.value) {
        isValid = false;
        input.classList.add('error');
        if(input.classList.contains('hidden-input')) {
          input.closest('.js-custom-select').classList.add('error');
        }
      }
    });

    if (isValid) {
      var formData = new FormData(this);
      var dataArray = [];
      formData.forEach(function(value, key) {
        dataArray.push({ key: key, value: value });
      });

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'your_php_script.php', true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
          console.log('Data sent successfully');
        } else {
          console.error('Error sending data');
        }
      };
      xhr.send(JSON.stringify(dataArray));
      console.log(dataArray);
    }
  });
  // scroll to section
  const mobMenu =  document.querySelector('.mobile-menu');
  document.querySelectorAll('.scroll-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetSelector = this.getAttribute('data-target');
      var target = document.querySelector(targetSelector);
      var headerHeight = document.querySelector('.header').offsetHeight;
      var offsetTop = target.offsetTop - headerHeight;
      mobMenu.classList.remove('open')

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    });
  });

  // open close menu
  const burger =  document.querySelector('.js-burger');

  const closeMEnu =  document.querySelector('.js-close-menu');
  burger.addEventListener('click', () => {
    mobMenu.classList.add('open')
  })
  closeMEnu.addEventListener('click', () => {
    mobMenu.classList.remove('open')
  })
})
