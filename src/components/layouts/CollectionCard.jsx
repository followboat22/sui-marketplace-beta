import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCollectionImageURL, statusToEffect, suiToMyst } from "../../utils/formats";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Avatar from "../layouts/Avatar";
import CollectionWishlistButton from "./CollectionWishlistButton";
import LazyLoadImage from "./LazyLoadImage";
import CreatedBy from "../utils/CreatedBy";
import {
  createLaunchpad,
  createLaunchpadContract,
  getLaunchpadsForCollection,
} from "../../utils/api";
import { createLaunchpad as setupLaunchpad } from "../../web3/sui";
import { sleep } from "../../utils/time";
import LoadingButton from "../button/LoadingButton";

const CollectionCard = ({ collection, owned, link, onClick, alwaysShowButton }) => {
  const [launchpad, setLaunchpad] = useState(false);
  const [launchpadLoading, setLaunchpadLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { _id, name, creator, review_status } = collection;
  const to = `${link || "/collection-details"}/${_id}`;
  const buttonText = launchpad?.object_id ? "Edit Mintpad" : "Create Mintpad";
  const linkProps = onClick
    ? {
        onClick: (e) => {
          e.preventDefault();
          onClick();
        },
        to,
      }
    : { to };
  const isCreator = useMemo(() => {
    return user && creator ? creator._id === user._id : false;
  }, [user, creator]);

  useEffect(() => {
    if (!!user.permissions?.launchpad_creator) {
      getLaunchpadsForCollection(_id).then((res) => {
        setLaunchpad(res.data[0]);
      });
    }
  }, []);

  const handleLaunchpad = async () => {
    if (!launchpad?.object_id) {
      setLaunchpadLoading(true);
      try {
        const tx = await setupLaunchpad(collection, ["10000000"], [false], ["10000000"]);
        await sleep();
        let res = await createLaunchpad({ collection: _id });
        await createLaunchpadContract(
          tx.effects.transactionDigest,
          res.data.launchpad._id
        );
        setLaunchpadLoading(false);
        navigate(`/edit-mintpad/${res.data.launchpad._id}`);
      } catch (error) {
        setLaunchpadLoading(false);
      }
    } else {
      navigate(`/edit-mintpad/${launchpad._id}`);
    }
  };

  return (
    <div className="sc-card-collection collection-card">
      <CollectionWishlistButton className="wishlist" collection={collection} />
      <Link {...linkProps}>
        <LazyLoadImage
          height="200px"
          className="collection-img-featured"
          src={getCollectionImageURL(_id, "featured")}
          key={`featured-${_id}`}
        />
        <div className="collection-img-logo ps-abs-mdl">
          <LazyLoadImage
            src={getCollectionImageURL(_id, "logo")}
            className="fullWidth"
            key={`logo-${_id}`}
          />
        </div>
      </Link>
      {alwaysShowButton && !!user.permissions?.launchpad_creator && (
        <div className="button-create-mintpad active">
          <LoadingButton
            onClick={handleLaunchpad}
            loading={launchpadLoading}
            className="sc-button style-place-bid style bag fl-button pri-3 fullWidth"
          >
            <span>{buttonText}</span>
          </LoadingButton>
        </div>
      )}
      <div className="card-bottom" style={{ height: "200px" }}>
        <div className="author collection-details">
          <div className="sc-author-box style-2">
            <div className="author-avatar">
              <Avatar creator={creator} size={64} />
              <div className="badge">
                <i className="ripple"></i>
              </div>
            </div>
          </div>
          <div className="content">
            <h4>
              <Link {...linkProps}>{name ?? "Unnamed Collection"}</Link>
            </h4>
            <div className="info">
              <span>Created by</span>
              <span className="name">
                <CreatedBy creator={creator} />
              </span>
            </div>
            {(isCreator || user.role_id == 3) && (
              <div className="ps-abs-b">
                <span className={`sc-status ${statusToEffect(review_status)} capitalize`}>
                  {review_status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
