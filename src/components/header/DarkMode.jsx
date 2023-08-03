import React, { useState } from "react";
import { Link } from "react-router-dom";

const DarkMode = () => {
  const lightTheme = "light";
  const darkTheme = "is_dark";
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? darkTheme);
  let clickedClass = "clicked";
  const body = document.body;

  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme);
  } else {
    body.classList.add(darkTheme);
  }

  const switchTheme = (e) => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      e.target.classList.remove(clickedClass);
      localStorage.setItem("theme", "light");
      setTheme(lightTheme);
    } else {
      body.classList.replace(lightTheme, darkTheme);
      e.target.classList.add(clickedClass);
      localStorage.setItem("theme", "is_dark");
      setTheme(darkTheme);
    }
  };
  return (
    <div className="mode_switcher">
      <Link to="#" onClick={(e) => switchTheme(e)}>
        {theme == darkTheme ? (
          <i className="fas fa-lightbulb-on"></i>
        ) : (
          <i className="fas fa-lightbulb-slash"></i>
        )}
      </Link>
    </div>
  );
};

export default DarkMode;
