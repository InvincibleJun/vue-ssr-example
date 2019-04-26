import LoadingBar from './LoadingBar';
import Vue from 'vue';

let timer, i, s, props, t;

function createInstance() {
  const Instance = new Vue({
    data: props,

    render(h) {
      return h(LoadingBar, { props });
    }
  });

  const component = Instance.$mount();

  document.body.appendChild(component.$el);
  const loading_bar = Instance.$children[0];

  return {
    update(option) {
      for (const i in option) {
        loading_bar[i] = option[i];
      }
    },
    destory() {}
  };
}

function update(option) {
  const Instance = i || (i = createInstance());

  setTimeout(() => {
    Instance.update(option);
  }, 0);
}

function hide() {
  t = setTimeout(() => {
    i.update({
      show: false
    });
  }, 300);
}

function config(option) {
  const { color = '#2d8cf0', height = 2, timeout = 20000 } = option;

  props = {
    color,
    height,
    timeout
  };
}

export default {
  start(option = {}) {
    if (t) {
      clearTimeout(t);
    }

    if (!i) {
      config(option);
    }

    if (timer) {
      clearInterval(timer);
    }

    let w = 0;

    s = +new Date();
    timer = setInterval(() => {
      if (+new Date() - s > props.timeout) {
        const { onError = () => {} } = option;

        return this.error(onError);
      }
      if (w > 90) {
        return;
      }

      update({
        show: true,
        status: 'loading',
        percent: (w += Math.floor(Math.random() * 2 + 1))
      });
    }, 200);
  },

  error(cb) {
    clearInterval(timer);
    update({
      percent: 100,
      status: 'error',
      show: true
    });
    cb();
    hide();
  },

  destroy() {
    document.body.removeChild(
      document.querySelector('.c-loading-bar-container')
    );
  },

  finish() {
    clearInterval(timer);
    update({ percent: 100 });
    hide();
  }
};
