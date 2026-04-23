import "./Loader.css";

const Loader = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div className="loader">
        <div className="box box-1">
          <div className="side-left"></div>
          <div className="side-right"></div>
          <div className="side-top"></div>
        </div>
        <div className="box box-2">
          <div className="side-left"></div>
          <div className="side-right"></div>
          <div className="side-top"></div>
        </div>
        <div className="box box-3">
          <div className="side-left"></div>
          <div className="side-right"></div>
          <div className="side-top"></div>
        </div>
        <div className="box box-4">
          <div className="side-left"></div>
          <div className="side-right"></div>
          <div className="side-top"></div>
        </div>
      </div>
      <p className="mt-8 text-sm text-muted">Loading...</p>
    </div>
  );
};

export default Loader;
