/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2017 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import _ from '../../locale.js';
import {is_defined} from '../../utils.js';

import Icon from './icon.js';

import SelectionType from '../selectiontype.js';

export const TrashIcon = ({selectionType, title, active = true, ...other}) => {
  if (!is_defined(title)) {
    if (selectionType === SelectionType.SELECTION_PAGE_CONTENTS) {
      title = _('Move page contents to trashcan');
    }
    else if (selectionType === SelectionType.SELECTION_USER) {
      title = _('Move selection to trashcan');
    }
    else if (selectionType === SelectionType.SELECTION_FILTER) {
      title = _('Move all filtered to trashcan');
    }
  }
  return (
    <Icon  {...other}
      img={active ? 'trashcan.svg' : 'trashcan_inactive.svg'}
      title={title}/>
  );
};

TrashIcon.propTypes = {
  active: React.PropTypes.bool,
  title: React.PropTypes.string,
  selectionType: React.PropTypes.string,
  onClick: React.PropTypes.func,
};


export default TrashIcon;

// vim: set ts=2 sw=2 tw=80:
