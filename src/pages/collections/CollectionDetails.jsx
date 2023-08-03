import CollectionInfo from "../../components/layouts/collections/CollectionInfo";
import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import SideBar from "../../components/layouts/SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { getCollection } from "../../utils/api";
import { useTitle } from "../../components/utils/TitleProvider";
import { SidebarProvider } from "../../components/utils/SidebarProvider";
import CollectionDetailsTabs from "../../components/layouts/CollectionDetailsTabs";

const CollectionDetails = () => {
  const { setTitle } = useTitle();
  const navigate = useNavigate();
  const params = useParams();
  const [collection, setCollection] = useState();

  useEffect(() => {
    if (params.id) {
      getCollection(params.id)
        .then((res) => {
          setCollection(res.data.collection);
          setTitle(res.data.collection.name + " - Collection");
        })
        .catch((e) => {
          navigate("/explore/collections", "replace");
        });
    }
  }, []);

  return (
    <div className="home-8">
      <Header />
      <section className="tf-item tf-section">
        <div className="themesflat-container">
          {!!collection && <CollectionInfo data={collection} />}
          <div className="row">
            <SidebarProvider>
              <div className="col-box-17">
                <SideBar />
              </div>
              <div className="col-box-83">
                <CollectionDetailsTabs collection={collection} />
              </div>
            </SidebarProvider>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectionDetails;
