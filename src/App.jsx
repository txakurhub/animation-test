import "./App.css";

function App() {
  const animation = document.querySelector(".animation");

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    animation.style.transform = `translate(-${x * 50}px, -${y * 50}px)`;
  });
  return (
    <div>
      <div className="background">
        <div className="animation"></div>
      </div>
    </div>
  );
}

export default App;
