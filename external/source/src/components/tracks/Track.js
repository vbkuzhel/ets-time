import React from 'react';
import classnames from 'classnames';

// Icons
import FaEllipsis from 'react-icons/lib/fa/ellipsis-h';

// Helpers
import { formatDateToServer } from './../../shared/HelpService';

// Components
import TrackBlockMenu from './TrackBlockMenu';
import TrackLineMenu from './TrackLineMenu';

class Track extends React.Component {
  state = {
    menuOpen: false
  };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render() {
    const { trackData: t, view } = this.props;
    const date = new Date(t.date_task);
    const dateStr = date ? formatDateToServer(date) : '';
    const project = typeof t.project === 'string' && t.project.length > 20
      ? t.project.substring(0, 20) + ' ...'
      : t.project;

    return (
      <div
        className={classnames('track', {
          track__block: view === 'block',
          track__line: view === 'line'
        })}
      >
        <div
          className={classnames({
            'track__info--line': view === 'line',
            'track__info--block': view === 'block'
          })}
        >
          <h3
            className={classnames('track__project', {
              'track__project--line': view === 'line'
            })}
          >
            {project}
          </h3>
          <h4
            className={classnames('track__type', {
              'track__type--line': view === 'line'
            })}
          >
            {t.type_work}
          </h4>
          <p
            className={classnames('track__date', {
              'track__date--line': view === 'line'
            })}
          >
            {dateStr}
          </p>
        </div>

        <div
          className={classnames('track__statusWrapper', {
            'track__statusWrapper--line': view === 'line'
          })}
        >
          <div
            className={classnames('track__status', {
              'track__status--open': t.status === 'Open',
              'track__status--accepted': t.status === 'Accepted',
              'track__status--declined': t.status === 'Declined',
              'track__status--line': view === 'line'
            })}
          >
            {t.status}
          </div>
          <span
            className={classnames('track__hours', {
              'track__hours--line': view === 'line'
            })}
          >
            {t.hours} hours
          </span>

          <TrackLineMenu view={view} />
        </div>

        {view === 'block'
          ? <button className="track__menuBtn" onClick={this.toggleMenu}>
              <FaEllipsis />
            </button>
          : null}

        <TrackBlockMenu
          t={t}
          menuOpen={this.state.menuOpen}
          toggleMenu={this.toggleMenu}
        />
      </div>
    );
  }
}

export default Track;