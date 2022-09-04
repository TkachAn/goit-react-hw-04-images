import { ThreeDots } from 'react-loader-spinner'; ///dist/loader/ThreeDots
import css from './Loader.module.css';

function Loader() {
  return (
    <div className={css.div}>
      <div className={css.overlay}>
        <ThreeDots
          height="100"
          width="100"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName={css.wrap}
          visible={true}
        />
      </div>
    </div>
  );
}

export default Loader;
