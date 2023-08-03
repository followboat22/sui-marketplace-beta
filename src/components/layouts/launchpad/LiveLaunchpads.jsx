import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { searchLaunchpads } from "../../../redux/state/search";
import LaunchpadCard from "./LaunchpadCard";
import LaunchpadCardSkeleton from "./LaunchpadCardSkeleton";

const LiveLaunchpads = ({ title, status, altBackground }) => {
  const dispatch = useDispatch();
  const launchpads = useSelector((state) => state.search.launchpads_custom[status]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [visible, setVisible] = useState(perPage);

  useEffect(() => {
    if (page > launchpads.curPage) {
      dispatch(
        searchLaunchpads({ status, perPage, sortParams: { start_date: 1 } }, status)
      ).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (nextPage > launchpads.curPage) {
      dispatch(
        searchLaunchpads(
          { status, page: nextPage, perPage, sortParams: { start_date: 1 } },
          status
        )
      ).then(() => {
        setLoading(false);
      });
    }
    setVisible(visible + perPage);
  };

  return (
    <section className={`tf-section mintpads ${altBackground ? "bg-style3" : ""}`}>
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions">
              <h2 className="tf-title pb-22 text-left">{title}</h2>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              {loading
                ? Array.from({ length: visible }, (_, index) => {
                    return (
                      <div
                        key={index}
                        className="fl-item col-xl-3 col-lg-6 col-md-6 col-sm-6"
                      >
                        <LaunchpadCardSkeleton />
                      </div>
                    );
                  })
                : launchpads?.results.slice(0, visible).map((item, index) => (
                    <div
                      key={index}
                      className="fl-item col-xl-3 col-lg-6 col-md-6 col-sm-6"
                    >
                      <LaunchpadCard item={item} />
                    </div>
                  ))}
              {launchpads?.count === 0 && (
                <div className="fl-item col-xl-6 col-lg-6 col-md-6 col-sm-6">
                  <h4 style={{ color: "#8a939b" }}>
                    There are no {status} mintpads at this time
                  </h4>
                </div>
              )}
              {launchpads?.pages > page && (
                <div className="col-md-12 wrap-inner load-more text-center">
                  <Link
                    to="#"
                    id="load-more"
                    className="sc-button loadmore fl-button pri-3 mt-10"
                    onClick={loadMore}
                  >
                    <span>Load More</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveLaunchpads;
