<template>
  <div class="py-4 container-fluid">
    <div class="row gx-4">
      <div class="col-lg-6">
        <timeline-list title="Timeline with dashed line">
          <timeline-item
            :icon="{ component: 'ni ni-bell-55', color: 'success' }"
            title="$2400 Design changes"
            date-time="22 DEC 7:20 PM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['design']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-html5', color: 'danger' }"
            title="New order #1832412"
            date-time="21 DEC 11 PM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['order', '#1832412']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-cart', color: 'info' }"
            title="Server payments for April"
            date-time="21 DEC 9:34 PM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['server', 'payments']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-credit-card', color: 'warning' }"
            title="New card added for order #4395133"
            date-time="20 DEC 2:20 AM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Card', '#4395133', 'Priority']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-key-25', color: 'primary' }"
            title="Unlock packages for development"
            date-time="18 DEC 4:54 AM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Development']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-archive-2', color: 'success' }"
            title="New message unread"
            date-time="16 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Message']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-check-bold', color: 'info' }"
            title="Notifications unread"
            date-time="15 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
          />
          <TimelineItem
            :icon="{ component: 'ni ni-box-2', color: 'warning' }"
            title="New request"
            date-time="14 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Request', 'Priority']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-controller', color: 'dark' }"
            title="Controller issues"
            date-time="13 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Controller']"
          />
        </timeline-list>
      </div>
      <div class="mt-4 col-lg-6 mt-lg-0">
        <timeline-list title="Timeline with dotted line" dark>
          <timeline-item
            :icon="{ component: 'ni ni-bell-55', color: 'success' }"
            title="$2400 Design changes"
            date-time="22 DEC 7:20 PM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['design']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-html5', color: 'danger' }"
            title="New order #1832412"
            date-time="21 DEC 11 PM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['order', '#1832412']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-cart', color: 'info' }"
            title="Server payments for April"
            date-time="21 DEC 9:34 PM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['server', 'payments']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-credit-card', color: 'warning' }"
            title="New card added for order #4395133"
            date-time="20 DEC 2:20 AM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Card', '#4395133', 'Priority']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-key-25', color: 'primary' }"
            title="Unlock packages for development"
            date-time="18 DEC 4:54 AM"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Development']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-archive-2', color: 'success' }"
            title="New message unread"
            date-time="16 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Message']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-check-bold', color: 'info' }"
            title="Notifications unread"
            date-time="15 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
          />
          <TimelineItem
            :icon="{ component: 'ni ni-box-2', color: 'warning' }"
            title="New request"
            date-time="14 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Request', 'Priority']"
          />
          <TimelineItem
            :icon="{ component: 'ni ni-controller', color: 'dark' }"
            title="Controller issues"
            date-time="13 DEC"
            description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
            :badges="['Controller']"
          />
        </timeline-list>
      </div>
    </div>
  </div>
</template>

<script>
import TimelineList from "@/examples/Cards/TimelineList.vue";
import TimelineItem from "@/examples/Cards/TimelineItem.vue";
export default {
  name: "Timeline",
  components: { TimelineList, TimelineItem },
};
</script>
