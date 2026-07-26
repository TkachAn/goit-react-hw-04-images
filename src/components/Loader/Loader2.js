// import { ThreeDots } from 'react-loader-spinner';
import css from './Loader1.module.css';

function Loader() {
  return (
    <>
      {/* <div class="loader-container">
        <div class="loader-1"></div>
			</div>
			
      <div class="loader-container">
        <div class="loader-2"></div>
			</div> */}

      <div class={css.loaderContainer}>
        <div class={css.loaderC}>
          {/* <div class={css.itemF}></div> */}
          <div class={css.itemA}></div>
          <div class={css.itemB}></div>
          <div class={css.itemC}></div>
          <div class={css.itemD}></div>
          <div class={css.itemE}></div>
          {/* <div class={css.itemF}></div>
          <div class={css.itemF}></div>
          <div class={css.itemF}></div>
          <div class={css.itemF}></div> */}
        </div>
      </div>

      {/* <div class="loader-container">
        <div class="loader-4"></div>
      </div> */}
    </>
  );
}

export default Loader;
