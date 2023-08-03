import React from "react";
import { Link } from "react-router-dom";
import { getCollectionImageURL } from "../../../utils/formats";
import LazyLoadImage from "../LazyLoadImage";
import styled from "styled-components";

const GridRow = styled.div`
  padding: 0 0.5rem;
  display: grid;
  align-items: center;
  height: 88px;
  border-radius: 1rem;
  cursor: pointer;
  background: var(--primary-color);
  transition: all 0.4s ease;
  grid-template-columns: repeat(2, minmax(0px, 1fr));
  &:hover {
    background: var(--hover-color);
  }
  @media screen and (min-width: 575px) {
    grid-template-columns: minmax(0px, 1.5fr) minmax(0px, 2fr);
    padding: 0 1rem;
  }
  @media screen and (min-width: 960px) {
    padding: 0 2rem;
  }
`;

const NameImageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
`;

const RowImage = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50px;
  overflow: hidden;
`;

const RowName = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
  letter-spacing: -0.5px;
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const RowDetails = styled.div`
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

const RowText = styled.p`
  font-weight: 500;
  font-size: 16px;
`;

const RowTextSmall = styled.p`
  font-weight: 500;
  font-size: 14px;
  color: rgb(138, 147, 155);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TextOverflow = styled.div`
  white-space: nowrap;
  overflow: hidden;
`;

const LaunchpadRow = ({ item, screenWidth }) => {
  const { _id, launchpad_collection, status, start_date } = item;
  const {
    _id: collection_id,
    name,
    nft_count: items,
    floor: price,
  } = launchpad_collection;
  const to = `/mintpad/${_id}`;
  const date = new Date(start_date);
  const stringDate = date.toLocaleString("default", {
    month: "short",
    day: "numeric",
  });
  const stringTime = date.toLocaleString("default", { timeStyle: "short" });
  const launchDate = `${stringDate}, ${stringTime}`;
  return (
    <Link to={to}>
      <GridRow>
        <NameImageWrapper>
          <RowImage>
            <LazyLoadImage
              className="launchpad-img-row"
              src={getCollectionImageURL(collection_id, "logo")}
              key={`featured-${_id}`}
            />
          </RowImage>
          <TextOverflow>
            <RowName>{name ?? "Unnamed Mintpad"}</RowName>
            {screenWidth <= 960 && <RowTextSmall>{launchDate}</RowTextSmall>}
          </TextOverflow>
        </NameImageWrapper>
        <RowDetails>
          {screenWidth > 960 && <RowText>{launchDate}</RowText>}
          <RowText>0.01 SUI</RowText>
          {screenWidth > 575 && <RowText>0.01 SUI</RowText>}
          <RowText>0 SUI</RowText>
        </RowDetails>
      </GridRow>
    </Link>
  );
};

export default LaunchpadRow;
