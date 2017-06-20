// Api services
import {
  getTracksApi,
  getDictionaries,
  createTrackApi
} from './../../shared/ApiService';

// Actions
import { setErrors } from './generalActions';

// Constants
import {
  SET_TRACKS,
  TOGGLE_SINGLE_TRACK,
  TOGGLE_TRACK_FILTERS,
  SET_WORK_TYPES,
  SET_STATUS_TYPES,
  SET_TRACK_FILTER,
  CLEAR_TRACK_FILTERS,
  CHANGE_TRACK_VIEW
} from './types';

// Helpers
import { getInitFilters } from './../../shared/HelpService';

export function getTracks(filters = getInitFilters()) {
  return dispatch => {
    getTracksApi(filters).then(resp => {
      if (resp.data) dispatch(setTracks(resp.data));
    });
  };
}

export function createTrack(data) {
  return dispatch => {
    createTrackApi(data).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(getTracks());
        dispatch(toggleSingleTrack());
      } else {
        resp.json().then(resp => {
          dispatch(setErrors(resp.errors));
        });
      }
    });
  };
}

export function getLibraries() {
  return dispatch => {
    getDictionaries().then(resp => {
      if (resp) {
        dispatch(setWorkTypes(resp.type_works));
        dispatch(setStatusTypes(resp.task_status));
      }
    });
  };
}

export function clearTrackFilters() {
  return {
    type: CLEAR_TRACK_FILTERS
  };
}

export function toggleSingleTrack() {
  return {
    type: TOGGLE_SINGLE_TRACK
  };
}

export function toggleTrackFilters() {
  return {
    type: TOGGLE_TRACK_FILTERS
  };
}

export function setTrackFilters(filters) {
  return {
    type: SET_TRACK_FILTER,
    filters
  };
}

export function changeTrackView(view) {
  return {
    type: CHANGE_TRACK_VIEW,
    view
  };
}

function setTracks(tracks) {
  return {
    type: SET_TRACKS,
    tracks
  };
}

function setWorkTypes(workTypes) {
  return {
    type: SET_WORK_TYPES,
    workTypes
  };
}

function setStatusTypes(statusTypes) {
  return {
    type: SET_STATUS_TYPES,
    statusTypes
  };
}