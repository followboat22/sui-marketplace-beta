import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchLaunchpads } from "../../redux/state/search";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import LiveLaunchpads from "../../components/layouts/launchpad/LiveLaunchpads";
import ThreeCardFeaturedLaunchpadSlider from "../../components/layouts/launchpad/ThreeCardFeaturedLaunchpadSlider";
import ThreeCardFeaturedLaunchpadSkeleton from "../../components/layouts/launchpad/ThreeCardFeaturedLaunchpadSkeleton";
import LaunchpadRows from "../../components/layouts/launchpad/LaunchpadRows";

const Launchpad = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.search.launchpads_custom["featured"].results);

  useEffect(() => {
    if (!data.length) {
      dispatch(
        searchLaunchpads(
          { featured: true, page: 1, perPage: 10, sortParams: { start_date: 1 } },
          "featured"
        )
      );
    }
  }, []);

  return (
    <div className="home-6">
      <Header />
      {data.length === 0 ? (
        <ThreeCardFeaturedLaunchpadSkeleton />
      ) : (
        <ThreeCardFeaturedLaunchpadSlider featuredData={data} />
      )}
      <LiveLaunchpads status="live" title="Live" />
      <LiveLaunchpads status="upcoming" title="Upcoming" />
      <LaunchpadRows status="ended" title="Released" />
      <Footer />
    </div>
  );
};

export default Launchpad;
