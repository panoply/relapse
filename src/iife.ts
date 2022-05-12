import relapse from './index';

if (document.readyState !== 'loading') {
  relapse.load();
} else {
  document.addEventListener('DOMContentLoaded', relapse.load);
}
