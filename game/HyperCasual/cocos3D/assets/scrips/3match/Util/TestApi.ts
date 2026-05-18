const TestApi = {
  user: {
    res: {
      data: {
        result: {
          access_token: "t_access_token",
          refresh_token: "t_refresh_token",
          username: "tester",
          score: 0,
          photo_url: "",
        },
      },
    },
  },

  "game/start": {
    res: {
      data: {
        result: {
          token: "testToken",
          session_id: "test1234",
          bingo_items: [
            {
              bingo_item_id: 1,
              quiz: {
                quiz_id: 1,
                answer_count: 2,
                lang: {
                  content:
                    "What is the feature for shooting vivid and smooth video?",
                },
                answers: [
                  {
                    content: "Director's View",
                    num: 2,
                  },
                  {
                    content: "Single Take ",
                    num: 3,
                  },
                  {
                    content: "Auto Framing",
                    num: 4,
                  },
                  {
                    content: "Super Steady System",
                    num: 1,
                  },
                ],
              },
            },
            {
              bingo_item_id: 2,
              quiz: {
                quiz_id: 2,
                answer_count: 1,
                lang: {
                  content:
                    " ' App Cast '  lets you freely use other apps while mirroring your phone’s video screen to your TV",
                },
                answers: [
                  {
                    content: null,
                    num: 4,
                  },
                  {
                    content: "Yes",
                    num: 1,
                  },
                  {
                    content: "No",
                    num: 2,
                  },
                  {
                    content: null,
                    num: 3,
                  },
                ],
              },
            },
          ],

          video_link: "https://www.youtube.com/watch?v=sGCmuVvLF64",
        },
      },
    },
  },

  "game/quiz": {
    res: {
      data: {
        result: {
          is_correct: false,
          answer_num: "1",
          is_done: true,
        },
      },
    },
  },

  "user/info": {
    res: {
      data: {
        result: {
          user_name: "tester",
          best_score: 70,
          ranking: 1,
          inventories: [
            {
              item_id: 2,
              item_count: 99,
              item: {
                name: "Bonus Boost",
                description: "10초 동안 10%의 점수 추가",
                effect_t: "score",
                effect_v: 10,
              },
            },
            {
              item_id: 3,
              item_count: 99,
              item: {
                name: "Time Boost",
                description: "시간 10초 추가",
                effect_t: "time",
                effect_v: 10,
              },
            },
            {
              item_id: 4,
              item_count: 99,
              item: {
                name: "Boom Boost",
                description: "시작할 때 특수 블록 추가",
                effect_t: "block",
                effect_v: 0,
              },
            },
          ],
        },
      },
    },
  },

  "game/event": {
    res: {
      data: {
        result: {
          // event: {
          //   id: 13,
          //   eventLangs: [
          //     {
          //       lang: "English",
          //       name: "start event",
          //       description:
          //         "event description. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          //     },
          //   ],
          // },
        },
      },
    },
  },

  "user/quiz": {
    res: {
      data: {
        result: {
          bingo: {
            id: 3,
            user_uid: "0517",
            is_done: false,
            is_rewarded: false,
          },
          items: [
            {
              id: 41,
              quiz_id: 475,
              num: 1,
              is_correct: -1,
              quiz: {
                content: "quiz 1 update test?",
              },
            },
            {
              id: 42,
              quiz_id: 489,
              num: 2,
              is_correct: -1,
              quiz: {
                content:
                  "What feature is NOT a Galaxy exclusive of 'Google Duo'? ",
              },
            },
            {
              id: 43,
              quiz_id: 479,
              num: 3,
              is_correct: -1,
              quiz: {
                content:
                  "Which of the following statements about Nightography in the Galaxy S22 Series is correct?",
              },
            },
            {
              id: 44,
              quiz_id: 476,
              num: 4,
              is_correct: -1,
              quiz: {
                content:
                  "What is the feature for shooting vivid and smooth video?",
              },
            },
            {
              id: 45,
              quiz_id: 484,
              num: 5,
              is_correct: -1,
              quiz: {
                content:
                  "Which of the following statements about Galaxy S22 Ultra is correct ?",
              },
            },
            {
              id: 46,
              quiz_id: 478,
              num: 6,
              is_correct: 1,
              quiz: {
                content:
                  "What is the main benefit of new 'Super HDR' technology for video ?",
              },
            },
            {
              id: 47,
              quiz_id: 487,
              num: 7,
              is_correct: -1,
              quiz: {
                content: "What is the latest enhancement for Link to Windows?",
              },
            },
            {
              id: 48,
              quiz_id: 486,
              num: 8,
              is_correct: -1,
              quiz: {
                content: "What is the new feature of One UI 4.1?",
              },
            },
            {
              id: 49,
              quiz_id: 483,
              num: 9,
              is_correct: -1,
              quiz: {
                content:
                  "What is the toughest glass used in the Galaxy S22 Series?",
              },
            },
            {
              id: 50,
              quiz_id: 493,
              num: 10,
              is_correct: 1,
              quiz: {
                content:
                  "What is NOT the improvement in Galaxy Tab S8+ compared to Galaxy Tab S7+?",
              },
            },
            {
              id: 51,
              quiz_id: 491,
              num: 11,
              is_correct: -1,
              quiz: {
                content:
                  "What is the most appropriate explanation of Galaxy Tab Series?",
              },
            },
            {
              id: 52,
              quiz_id: 485,
              num: 12,
              is_correct: -1,
              quiz: {
                content:
                  "What is not the difference between the Galaxy S22/S22+ and the Galaxy S22 Ultra?",
              },
            },
            {
              id: 53,
              quiz_id: 488,
              num: 13,
              is_correct: -1,
              quiz: {
                content:
                  " ' App Cast '  lets you freely use other apps while mirroring your phone’s video screen to your TV",
              },
            },
            {
              id: 54,
              quiz_id: 492,
              num: 14,
              is_correct: -1,
              quiz: {
                content:
                  "All Galaxy Tab S8 model offer a smooth scrolling experience with 120Hz refresh rate.",
              },
            },
            {
              id: 55,
              quiz_id: 490,
              num: 15,
              is_correct: -1,
              quiz: {
                content: "What are the benefits of Quick Share?",
              },
            },
            {
              id: 56,
              quiz_id: 494,
              num: 16,
              is_correct: -1,
              quiz: {
                content:
                  "Which is NOT the correct explanation of Galaxy Tab S8 Series?",
              },
            },
            {
              id: 57,
              quiz_id: 477,
              num: 17,
              is_correct: -1,
              quiz: {
                content:
                  "What is the main benefit of new 'Super Clear Glass' on Rear camera ?",
              },
            },
            {
              id: 58,
              quiz_id: 482,
              num: 18,
              is_correct: -1,
              quiz: {
                content:
                  "All Galaxy S22 Series support up to 45W super fast charging.",
              },
            },
            {
              id: 59,
              quiz_id: 480,
              num: 19,
              is_correct: 0,
              quiz: {
                content:
                  "What factor makes the Galaxy S22 Series the fastest processing speed and lowest power consumption?",
              },
            },
            {
              id: 60,
              quiz_id: 481,
              num: 20,
              is_correct: -1,
              quiz: {
                content:
                  "Which of the following is not a technology for the display of the Galaxy S22 Series?",
              },
            },
          ],
        },
      },
    },
  },

  "game/leaderboard": {
    res: {
      data: {
        result: {
          my_ranking: 1,
          my_best_score: 9354,
          best_score: [
            {
              ranking: 1,
              user_uid: "1280305",
              score: 141308,
              name: "tester1@test.com",
            },
            {
              ranking: 2,
              user_uid: "1280305",
              score: 141308,
              name: "tester2@test.com",
            },
            {
              ranking: 3,
              user_uid: "1280305",
              score: 141308,
              name: "tester3@test.com",
            },
          ],
          event_participated: true,
        },
      },
    },
  },

  "game/over": {
    res: {
      data: {
        result: {
          is_new_record: false,
        },
      },
    },
  },

  "user/quiz/reward": {
    res: {
      data: {
        result: {
          item: {
            name: "Bonus Boost",
            description: "10초 동안 10%의 점수 추가",
            effect_t: "score",
            effect_v: 10,
          },
        },
      },
    },
  },

  lang: {
    res: {
      data: {
        result: {
          langs: [
            {
              lang: "Albanian",
            },
            {
              lang: "Arabic",
            },
            {
              lang: "Azerbaijan",
            },
            {
              lang: "Bengali",
            },
            {
              lang: "Bosnian",
            },
            {
              lang: "Bulgarian",
            },
            {
              lang: "Chinese  (Taiwan)",
            },
            {
              lang: "Chinese (Hongkong)",
            },
            {
              lang: "Chinese (PRC)",
            },
            {
              lang: "Croatian",
            },
            {
              lang: "Czech",
            },
            {
              lang: "Danish",
            },
            {
              lang: "English",
            },
            {
              lang: "Estonian",
            },
            {
              lang: "Finnish",
            },
            {
              lang: "French",
            },
            {
              lang: "French(Canada)",
            },
            {
              lang: "Georgian",
            },
            {
              lang: "German",
            },
            {
              lang: "Greek",
            },
            {
              lang: "Hebrew",
            },
            {
              lang: "Hungarian",
            },
            {
              lang: "Indonesian",
            },
            {
              lang: "Italian",
            },
            {
              lang: "Japanese",
            },
            {
              lang: "Kazakh",
            },
            {
              lang: "Khmer",
            },
            {
              lang: "Laos",
            },
            {
              lang: "Latvian",
            },
            {
              lang: "Lithuanian",
            },
            {
              lang: "Macedonian",
            },
            {
              lang: "Myanmar",
            },
            {
              lang: "Norwegian (Bokmal)",
            },
            {
              lang: "Polish",
            },
            {
              lang: "Portuguese",
            },
            {
              lang: "Portuguese(Brazil)",
            },
            {
              lang: "Romanian",
            },
            {
              lang: "Russian",
            },
            {
              lang: "Serbian",
            },
            {
              lang: "Slovak",
            },
            {
              lang: "Slovenian",
            },
            {
              lang: "Spanish",
            },
            {
              lang: "Spanish(LTN)",
            },
            {
              lang: "Swedish (Sweden)",
            },
            {
              lang: "Thai",
            },
            {
              lang: "Turkish",
            },
            {
              lang: "Uzbek",
            },
            {
              lang: "Vietnamese",
            },
          ],
        },
      },
    },
  },
};

export default TestApi;
