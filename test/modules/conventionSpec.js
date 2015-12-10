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
                            'type': 'String'
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
                            'type': 'String'
                        },
                        {
                            'name': 'name',
                            'type': 'String'
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
