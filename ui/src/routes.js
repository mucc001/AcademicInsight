import ReviewList from './ReviewList.jsx';
import ReviewEdit from './ReviewEdit.jsx';
import ReviewDetail from './ReviewDetail.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/reviews/:id?', component: ReviewList },
  { path: '/view/:id?', component: ReviewDetail },
  { path: '/edit/:id', component: ReviewEdit },
  { path: '/about', component: About },
  { path: '*', component: NotFound },
];

export default routes;
