export default function (filters: any, createdAt: any) {
  return [
    {
      $match: {
        $and: [
          ...filters,
          {
            createdAt: {
              $gte: new Date(createdAt[0][0]),
              $lte: new Date(createdAt[0][1]),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'checkinouts',
        localField: 'checkIn',
        foreignField: '_id',
        as: 'checkIn',
      },
    },
    {
      $lookup: {
        from: 'checkinouts',
        localField: 'checkOut',
        foreignField: '_id',
        as: 'checkOut',
      },
    },
    { $unwind: '$checkIn' },
    { $unwind: { path: '$checkOut', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'checkIn.user',
        foreignField: '_id',
        as: 'checkIn.user',
        pipeline: [
          {
            $project: {
              username: 1,
              carnet: 1,
              userInformation: 1,
            },
          },
          {
            $lookup: {
              from: 'userinformations',
              localField: 'userInformation',
              foreignField: '_id',
              as: 'userInformation',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    lastname: 1,
                  },
                },
              ],
            },
          },
          { $unwind: '$userInformation' },
        ],
      },
    },
    { $unwind: '$checkIn.user' },
    {
      $lookup: {
        from: 'physicalpositions',
        localField: 'checkIn.physicalPosition',
        foreignField: '_id',
        as: 'checkIn.physicalPosition',
      },
    },
    { $unwind: '$checkIn.physicalPosition' },
    {
      $lookup: {
        from: 'agencies',
        localField: 'checkIn.physicalPosition.agency',
        foreignField: '_id',
        as: 'checkIn.physicalPosition.agency',
      },
    },
    { $unwind: '$checkIn.physicalPosition.agency' },
    {
      $lookup: {
        from: 'businesses',
        localField: 'checkIn.physicalPosition.agency.business',
        foreignField: '_id',
        as: 'checkIn.physicalPosition.agency.business',
      },
    },
    { $unwind: '$checkIn.physicalPosition.agency.business' },
    {
      $lookup: {
        from: 'workdays',
        localField: 'schedule',
        foreignField: '_id',
        as: 'schedule',
      },
    },
    { $unwind: '$schedule' },
    {
      $lookup: {
        from: 'reasons',
        localField: 'checkIn.positionReason',
        foreignField: '_id',
        as: 'checkIn.positionReason',
      },
    },
    {
      $unwind: {
        path: '$checkIn.positionReason',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'reasons',
        localField: 'checkIn.timeReason',
        foreignField: '_id',
        as: 'checkIn.timeReason',
      },
    },
    {
      $unwind: {
        path: '$checkIn.timeReason',
        preserveNullAndEmptyArrays: true,
      },
    },
    /*     {
      $lookup: {
        from: 'reasons',
        localField: 'checkOut.positionReason',
        foreignField: '_id',
        as: 'checkOut.positionReason',
      },
    },
    {
      $unwind: {
        path: '$checkOut.positionReason',
        preserveNullAndEmptyArrays: true,
      },
    }, */
    {
      $lookup: {
        from: 'reasons',
        localField: 'checkOut.timeReason',
        foreignField: '_id',
        as: 'checkOut.timeReason',
      },
    },
    {
      $unwind: {
        path: '$checkOut.timeReason',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        schedule: {
          schedule: 1,
        },
        checkData: 1,
        checkIn: {
          createdAt: 1,
          user: 1,
          positionReason: {
            reason: 1,
            time: 1,
            position: 1,
          },
          timeReason: {
            reason: 1,
            time: 1,
            position: 1,
          },
          physicalPosition: {
            agency: {
              name: 1,
              business: {
                base_salary: 1,
                extra_on_week: 1,
                extra_salary: 1,
                name: 1,
                nickname: 1,
              },
            },
          },
        },
        checkOut: {
          createdAt: 1,
          /*           positionReason: {
            reason: 1,
            time: 1,
            position: 1,
          }, */
          timeReason: {
            reason: 1,
            time: 1,
            position: 1,
          },
        },
      },
    },
  ];
}
