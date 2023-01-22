import axios from "axios";
import { badgesAssets } from "./BadgesAssets";
import { API_URL } from "./constants";

export default class BadgesSingleton {
  static #instance;
  #listeners = new Map();
  #badges = [];

  constructor() {
    if (BadgesSingleton.#instance) {
      throw new Error("Constructor is meant to be private!");
    }

    this.isInitialised = false;
    this.isInitiliasing = false;
    return this;
  }

  static getInstance() {
    if (!BadgesSingleton.#instance) {
      BadgesSingleton.#instance = new BadgesSingleton();
      BadgesSingleton.#instance.#init();
    }

    return BadgesSingleton.#instance;
  }

  #init = () => {
    if (!this.isInitialised && !this.isInitiliasing) {
      this.isInitiliasing = true;

      axios
        .get(`${API_URL}/badges`)
        .then(({ data }) => {
          if (data.success) {
            this.#badges = data.badges;
            this.isInitialised = true;

            this.#propagateToListeners();
          }
        })
        .finally(() => {
          this.isInitiliasing = false;
        });
    }
  };

  #propagateToListeners = () => {
    this.#listeners.forEach((cb) => {
      cb(this.badges);
    });
  };

  get badges() {
    return this.#badges.map((badge) => ({
      ...badge,
      image: badgesAssets[badge.identifier],
    }));
  }

  onReady = (cb) => {
    if (this.isInitialised) {
      cb(this.badges);
      return;
    }

    if (this.#listeners.has(cb)) {
      return;
    }

    this.#listeners.set(cb, cb);
  };

  removeListener = (cb) => {
    if (this.#listeners.has(cb)) {
      this.#listeners.delete(cb);
    }
  };

  getBadgeById = (id) => {
    return this.badges.find((badge) => badge._id === id);
  };
}
