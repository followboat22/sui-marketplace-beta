import React from "react";
import Header from "../components/header/Header";
import SideBar from "../components/layouts/SideBar";
import ExploreTabs from "../components/layouts/ExploreTabs";
import { SidebarProvider } from "../components/utils/SidebarProvider";

const Explore = () => {
  return (
    <div className="home-8">
      <Header />
      <section className="tf-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <SidebarProvider>
              <div className="col-box-17">
                <SideBar />
              </div>
              <div className="col-box-83">
                <ExploreTabs />
              </div>
            </SidebarProvider>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
