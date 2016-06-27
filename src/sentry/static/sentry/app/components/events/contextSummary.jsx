import React from 'react';

import Avatar from '../../components/avatar';
import PropTypes from '../../proptypes';
import {t} from '../../locale';
import {objectIsEmpty} from '../../utils';

const NoSummary = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },

  render() {
    return (
      <div className="context-item">
        <span className="context-item-icon" />
        <h3>{this.props.title}</h3>
      </div>
    );
  }
});

const GenericSummary = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    unknownTitle: React.PropTypes.string.isRequired,
  },

  render() {
    let data = this.props.data;

    if (objectIsEmpty(data) || !data.name) {
      return <NoSummary title={this.props.unknownTitle} />;
    }

    let className = data.name.split(/\d/)[0].toLowerCase();

    return (
      <div className={`context-item ${className}`}>
        <span className="context-item-icon" />
        <h3>{data.name}</h3>
        <p><strong>{t('Version:')}</strong> {data.version || t('Unknown Version')}</p>
      </div>
    );
  },
});

const UserSummary = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  render() {
    let user = this.props.data;

    if (objectIsEmpty(user)) {
      return <NoSummary title={t('Unknown User')} />;
    }

    let userTitle = (user.email ?
      user.email :
      user.ipAddress || user.id || user.username);

    if (!userTitle) {
      return <NoSummary title={t('Unknown User')} />;
    }

    return (
      <div className="context-item user">
        <Avatar user={user} size={48} className="context-item-icon"
                gravatar={false} />
        <h3>{userTitle}</h3>
        {user.id && user.id !== userTitle ?
          <p><strong>{t('ID:')}</strong> {user.id}</p>
        : (user.username && user.username !== userTitle &&
          <p><strong>{t('Username:')}</strong> {user.username}</p>
        )}
      </div>
    );
  },
});

const DeviceSummary = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  render() {
    let data = this.props.data;

    if (objectIsEmpty(data) || !data.model) {
      return <NoSummary title={t('Unknown Device')} />;
    }

    // TODO(dcramer): we need a better way to parse it
    let className = data.model.split(/\d/)[0].toLowerCase();

    return (
      <div className={`context-item ${className}`}>
        <span className="icon" />
        <h3>{data.model}</h3>
        <p>{data.arch || data.model_id || ''}</p>
      </div>
    );
  },
});

const EventContextSummary = React.createClass({
  propTypes: {
    group: PropTypes.Group.isRequired,
    event: PropTypes.Event.isRequired,
  },

  render() {
    let evt = this.props.event;
    let contexts = evt.contexts;

    let children = [<UserSummary key="user" data={evt.user} />];
    switch (evt.platform) {
      case 'cocoa':
        children.push((
          <DeviceSummary
            key="device"
            data={contexts.device} />
        ));
        children.push((
          <GenericSummary
            key="os"
            data={contexts.os}
            unknownTitle={t('Unknown OS')} />
        ));
        break;
      case 'javascript':
        children.push((
          <GenericSummary
            key="browser"
            data={contexts.browser}
            unknownTitle={t('Unknown Browser')} />
        ));
        children.push((
          <GenericSummary
            key="os"
            data={contexts.os}
            unknownTitle={t('Unknown OS')} />
        ));
        break;
      default:
        children.push((
          <GenericSummary
            key="runtime"
            data={contexts.runtime}
            unknownTitle={t('Unknown Runtime')} />
        ));
        children.push((
          <GenericSummary
            key="os"
            data={contexts.os}
            unknownTitle={t('Unknown OS')} />
        ));
        break;
    }

    return (
      <div className="context-summary">
        {children}
      </div>
    );
  }
});

export default EventContextSummary;
