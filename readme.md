# Matter In Motion. User groups extension

[![NPM Version](https://img.shields.io/npm/v/mm-user-groups.svg?style=flat-square)](https://www.npmjs.com/package/mm-user-groups)
[![NPM Downloads](https://img.shields.io/npm/dt/mm-user-groups.svg?style=flat-square)](https://www.npmjs.com/package/mm-user-groups)

This extension adds groups support for a user resource

## Usage

[Extensions installation intructions](https://github.com/matter-in-motion/mm/blob/master/docs/extensions.md)

## Settings

This extension adds settings into user settings

* sudo — string, default 'sudo'. Name of the superuser group that allowed to manage other users groups.

## API

*All methods require a user to be authorized*

### user.addGroup

Adds the user to the group.

**Request**

* **group** — string, group to add
* user — uuid, an id of the user group will be added to. If not provided authorized user id will be used

**Response**

* `true` — when group was added
* `Unauthorized` error, code 4100 — when user doesn't have permission to change groups
* `NotFound` error, code 4540 — when user not found
* `AlreadyAMemberError` error, code 4521 — when user is already a member of the group

### user.deleteGroup

Deletes the user from the group.

**Request**

* **group** — string, group to add
* user — uuid, an id of the user group will be deleted from. If not provided authorized user id will be used

**Response**

* `true` — when group was added
* `Unauthorized` error, code 4100 — when user doesn't have permission to change groups
* `NotFound` error, code 4540 — when user not found
* `NotAMemberError` error, code 4522 — when user is not a member of the group

### user.hasGroup

Check if user in the group

**Request**

* **group** — string, group to add
* user — uuid, an id of the user to check. If not provided authorized user id will be used

**Response**

* `true` — when user is a member of the group
* `NotAMemberError` error, code 4522 — when user is not a member of the group
* `NotFound` error, code 4540 — when user not found

## Commands

### user addGroup <email> <group>
Adds the user to the group

### user deleteGroup <email> <group>
Deletes the user from the group


License: MIT

© velocityzen
