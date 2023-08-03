import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OwnedNFTCard from "../../../../components/layouts/profile/OwnedNFTCard";
import NFTSkeleton from "../../../../components/layouts/NFTSkeleton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getContents } from "../../../../redux/state/sui";

const MyOwnedNFTsList = ({ setCount, setPages }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const sui = useSelector((state) => state.sui);
  const contents = sui.contents.filter((item) => item.data.url);
  const connected = sui.connected;
  const navigate = useNavigate();
  const pageSize = 20;

  useEffect(() => {
    if (user._id && connected) {
      dispatch(getContents(contents))
        .then(() => {
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, connected]);

  const [params] = useSearchParams();
  const page = params.get("p") || 1;

  useEffect(() => {
    setCount(contents.length);
    setPages(Math.ceil(contents.length / pageSize));
  }, [contents]);

  const sellHandler = (nft) => {
    navigate(`/list-nft?id=${nft.id}`);
  };

  const rentHandler = (nft) => {
    navigate(`/loan?id=${nft.id}`);
  };

  return (
    <div className="row">
      {loading
        ? Array.from({ length: 15 }, (_, index) => {
            return (
              <div key={index} className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <NFTSkeleton />
              </div>
            );
          })
        : contents.slice((page - 1) * pageSize, page * pageSize).map((item) => (
            <div key={item.id} className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <OwnedNFTCard
                item={item}
                sellHandler={sellHandler}
                rentHandler={rentHandler}
              />
            </div>
          ))}
    </div>
  );
};

export default MyOwnedNFTsList;
