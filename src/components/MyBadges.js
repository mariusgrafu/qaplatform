import axios from "axios";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";

import "./MyBadges.scss";
import BadgesSingleton from "../BadgesSingleton";
import { API_URL } from "../constants";
import { useAuth } from "../contexts/AuthContext";

const BADGE_SIZE = 64; // in px

export default function MyBadges() {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);

  const { currentUser } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    const badgesSingletonInstance = BadgesSingleton.getInstance();
    const updateBadges = (newBadges) => {
      setLoading(false);
      setBadges(newBadges);
    };

    badgesSingletonInstance.onReady(updateBadges);

    return () => badgesSingletonInstance.removeListener(updateBadges);
  }, []);

  const updateBadgeInfo = useCallback(() => {
    currentUser.getIdToken().then((token) => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios.get(`${API_URL}/user/badge-info`, authHeader).then(({ data }) => {
        if (data.success) {
          setCurrentPoints(data.points);
          setSelectedBadge(data.badge);
        }
      });
    });
  }, [currentUser]);

  useEffect(() => {
    updateBadgeInfo();
  }, [updateBadgeInfo]);

  const setBadge = useCallback(
    (badgeId) => {
      currentUser.getIdToken().then((token) => {
        const authHeader = {
          headers: { Authorization: `Bearer ${token}` },
        };

        axios
          .post(`${API_URL}/user/set-badge`, { badgeId }, authHeader)
          .then(({ data }) => {
            if (data.success) {
              updateBadgeInfo();
            }
          });
      });
    },
    [currentUser, updateBadgeInfo]
  );

  const renderBadges = useCallback(() => {
    if (loading) {
      return null;
    }

    return badges.map((badge) => {
      const isSelected = badge._id === selectedBadge;
      const canAfford = currentPoints >= badge.requiredPoints;
      return (
        <div className="badge-item-container">
          <div
            key={badge._id}
            className={classNames("badge-item", {
              selected: isSelected,
              unaffordable: !canAfford,
            })}
          >
            <img
              className="mb-3"
              src={badge.image}
              alt={badge.title}
              width={BADGE_SIZE}
              height={BADGE_SIZE}
              draggable={false}
            />
            <div className="details">
              <h5>{badge.title}</h5>
              <p>Required Points: {badge.requiredPoints.toLocaleString()}</p>
            </div>
            <div className="btn-container">
              {isSelected ? (
                <Button
                  variant="primary-outline"
                  onClick={() => setBadge(null)}
                >
                  Un-Equip
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={!canAfford}
                  onClick={() => setBadge(badge._id)}
                >
                  Equip
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    });
  }, [badges, loading, currentPoints, selectedBadge, setBadge]);

  return (
    <Container fluid="lg">
      <div className="title-container mb-3">
        <h4 className="special-text">My Badges</h4>
        <div className="user-info">
          Current Points <strong>{currentPoints.toLocaleString()}</strong>
        </div>
      </div>
      <Row className="badges-container mb-4 g-3" lg={3} md={2} xs={1}>
        {renderBadges()}
      </Row>
    </Container>
  );
}
