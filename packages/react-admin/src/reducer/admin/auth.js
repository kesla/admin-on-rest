import {
    USER_CHECK_SUCCESS,
    USER_LOGIN_SUCCESS,
} from '../../actions/authActions';

const initialState = {
    user: null,
    permissions: {},
};

const getPermissionsKey = ({ key = '@ra-root', resource, params }) => {
    let keyParams = '';

    if (params) {
        const keys = Object.keys(params);

        if (keys.length > 0) {
            keyParams = keys.reduce(
                (acc, name, index) =>
                    `${acc}${params[name]}${index < keys.lenth ? '/' : ''}`,
                '/'
            );
        }
    }

    if (resource) {
        return `${resource}/${key}${keyParams}`;
    }

    return `${key}${keyParams}`;
};

export default (previousState = initialState, action) => {
    switch (action.type) {
        case USER_CHECK_SUCCESS: {
            const { resource, route } = action.meta;
            const fullKey = getPermissionsKey({
                key: route,
                resource,
                params: action.meta ? action.meta.routeParams : undefined,
            });
            return {
                ...previousState,
                permissions: {
                    ...previousState.permissions,
                    [fullKey]: action.payload,
                },
            };
        }
        case USER_LOGIN_SUCCESS:
            return {
                ...previousState,
                user: action.payload,
            };
        default:
            return previousState;
    }
};

export const getPermissions = (state, { key, resource, params }) => {
    const fullKey = getPermissionsKey(key, resource, params);
    if (state && state.permissions) {
        return state.permissions[fullKey];
    }

    return null;
};
