//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

'use strict';

describe('[CONVENTION] Defaults', function () {
    it('Add Defaults should work.', function () {
        var input = {
            'types': [
                {
                    'properties': [
                        {
                            'name': 'ID',
                            'isKey': true
                        },
                        {
                            'name': 'name',
                            'type': 'edm.string'
                        }
                    ],
                    'name': 'Person'
                }
            ],
            'container': {
                'entitysets': [
                    {
                        'name': 'People',
                        'type': 'Person',
                        'allows': ['read', 'update']
                    }
                ],
                'singletons': [
                    {
                        'name': 'Me',
                        'type': 'Person'
                    }
                ]
            }
        };

        var expected = {
            'types': [
                {
                    'properties': [
                        {
                            'name': 'ID',
                            'isKey': true,
                            'type': 'edm.string'
                        },
                        {
                            'name': 'name',
                            'type': 'edm.string'
                        }
                    ],
                    'name': 'Person'
                }
            ],
            'container': {
                'entitysets': [
                    {
                        'name': 'People',
                        'type': 'Person',
                        'allows': ['read', 'update']
                    }
                ],
                'singletons': [
                    {
                        'name': 'Me',
                        'type': 'Person',
                        'allows': ['read']
                    }
                ]
            }
        };

        Morpho.addDefaults(input);
        expect('\n' + JSON.stringify(input)).toEqual('\n' + JSON.stringify(expected));
    });
});
