import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { searchLaunchpads } from "../../../redux/state/search";
import LaunchpadRow from "./LaunchpadRow";
import styled from "styled-components";
import { useWindowSize } from "../../../utils/hooks";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.h2`
  padding-bottom: 22px;
  line-height: 44px;
  color: var(--primary-color2);
  font-size: 24px;

  @media screen and (min-width: 575px) {
    font-size: 36px;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GridHeader = styled.div`
  display: grid;
  padding: 0 0.5rem;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0px, 1fr));

  @media screen and (min-width: 575px) {
    grid-template-columns: minmax(0px, 1.5fr) minmax(0px, 2fr);
    padding: 0 1rem;
    margin-bottom: 1rem;
  }
  @media screen and (min-width: 960px) {
    padding: 0 2rem;
  }
`;

const InnerGridHeader = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0px, 1fr));

  @media screen and (min-width: 575px) {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
  }
  @media screen and (min-width: 960px) {
    grid-template-columns: minmax(0px, 1.25fr) repeat(3, minmax(0px, 1fr));
  }
`;

const HeaderSort = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  gap: 0.25rem;
  font-size: 10px;
`;

const HeaderText = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  font-weight: 800;
  font-size: 10px;
  text-transform: uppercase;
  color: rgb(138, 147, 155);

  @media screen and (min-width: 575px) {
    font-size: 12px;
    font-weight: 600;
  }
`;

const LaunchpadRows = ({ title, status, altBackground }) => {
  const dispatch = useDispatch();
  const launchpads = useSelector((state) => state.search.launchpads_custom[status]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [visible, setVisible] = useState(perPage);
  const screenWidth = useWindowSize().width;

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
        <FlexColumn>
          <SectionHeader>{title}</SectionHeader>
          {launchpads?.count === 0 ? (
            <div>
              <h4 style={{ color: "#8a939b" }}>
                There are no {status} mintpads at this time
              </h4>
            </div>
          ) : (
            <div>
              <GridHeader>
                <HeaderText>Collection</HeaderText>
                <InnerGridHeader>
                  {screenWidth > 960 && (
                    <HeaderSort>
                      <HeaderText>Launched</HeaderText>
                    </HeaderSort>
                  )}
                  <HeaderText>Floor</HeaderText>
                  {screenWidth > 575 && <HeaderText>Mint Price</HeaderText>}
                  <HeaderText>Total Volume</HeaderText>
                </InnerGridHeader>
              </GridHeader>
              <RowContainer>
                {launchpads?.results.slice(0, visible).map((item, index) => (
                  <LaunchpadRow key={index} item={item} screenWidth={screenWidth} />
                ))}

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
              </RowContainer>
            </div>
          )}
        </FlexColumn>
      </div>
    </section>
  );
};

export default LaunchpadRows;
